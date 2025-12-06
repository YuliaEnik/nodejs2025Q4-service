import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackEntity } from './track.entity';
import { CreateTrackDto, UpdateTrackDto } from './track.types';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(TrackEntity)
    private trackRepository: Repository<TrackEntity>,
    private readonly favoritesService: FavoritesService,
  ) {}

  async findAll(): Promise<TrackEntity[]> {
    return this.trackRepository.find();
  }

  async findById(id: string): Promise<TrackEntity> {
    this.validateUuid(id);
    const track = await this.trackRepository.findOneBy({ id });
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  async create(createTrackDto: CreateTrackDto): Promise<TrackEntity> {
    const newTrack = this.trackRepository.create(createTrackDto);
    return this.trackRepository.save(newTrack);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<TrackEntity> {
    this.validateUuid(id);
    
    const track = await this.findById(id);
    
    const updatedTrack = this.trackRepository.merge(track, updateTrackDto);
    return this.trackRepository.save(updatedTrack);
  }

  async delete(id: string): Promise<void> {
    this.validateUuid(id);
    
    const track = await this.trackRepository.findOneBy({ id });
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    await this.favoritesService.removeTrack(id);
    
    await this.trackRepository.remove(track);
  }

  async setArtistIdToNull(artistId: string): Promise<void> {
    await this.trackRepository
      .createQueryBuilder()
      .update(TrackEntity)
      .set({ artistId: null })
      .where('artistId = :artistId', { artistId })
      .execute();
  }

  async setAlbumIdToNull(albumId: string): Promise<void> {
    await this.trackRepository
      .createQueryBuilder()
      .update(TrackEntity)
      .set({ albumId: null })
      .where('albumId = :albumId', { albumId })
      .execute();
  }

  private validateUuid(id: string): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException('Invalid UUID');
    }
  }
}
