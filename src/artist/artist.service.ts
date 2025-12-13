import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtistEntity } from './artist.entity';
import { CreateArtistDto, UpdateArtistDto } from './artist.types';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(ArtistEntity)
    private artistRepository: Repository<ArtistEntity>,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
  ) {}

  async findAll(): Promise<ArtistEntity[]> {
    return this.artistRepository.find();
  }

  async findById(id: string): Promise<ArtistEntity> {
    this.validateUuid(id);
    const artist = await this.artistRepository.findOneBy({ id });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  async create(createArtistDto: CreateArtistDto): Promise<ArtistEntity> {
    const newArtist = this.artistRepository.create(createArtistDto);
    return this.artistRepository.save(newArtist);
  }

  async update(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<ArtistEntity> {
    this.validateUuid(id);

    const artist = await this.findById(id);
    const updatedArtist = this.artistRepository.merge(artist, updateArtistDto);
    return this.artistRepository.save(updatedArtist);
  }

  async delete(id: string): Promise<void> {
    this.validateUuid(id);

    const artist = await this.artistRepository.findOneBy({ id });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    await this.trackService.setArtistIdToNull(id);
    await this.albumService.setArtistIdToNull(id);

    await this.artistRepository.remove(artist);
  }

  private validateUuid(id: string): void {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException('Invalid UUID');
    }
  }
}
