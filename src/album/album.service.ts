import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumEntity } from './album.entity';
import { CreateAlbumDto, UpdateAlbumDto } from './album.types';
import { TrackService } from '../track/track.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumEntity)
    private albumRepository: Repository<AlbumEntity>,
    private readonly trackService: TrackService,
    private readonly favoritesService: FavoritesService,
  ) {}

  async findAll(): Promise<AlbumEntity[]> {
    return this.albumRepository.find();
  }

  async findById(id: string): Promise<AlbumEntity> {
    this.validateUuid(id);
    const album = await this.albumRepository.findOneBy({ id });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<AlbumEntity> {
    const newAlbum = this.albumRepository.create(createAlbumDto);
    return this.albumRepository.save(newAlbum);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<AlbumEntity> {
    this.validateUuid(id);
    
    const album = await this.findById(id);
    
    const updatedAlbum = this.albumRepository.merge(album, updateAlbumDto);
    return this.albumRepository.save(updatedAlbum);
  }

  async delete(id: string): Promise<void> {
    this.validateUuid(id);
    
    const album = await this.albumRepository.findOneBy({ id });
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    await this.trackService.setAlbumIdToNull(id);
    
    await this.favoritesService.removeAlbum(id);
    
    await this.albumRepository.remove(album);
  }

  async setArtistIdToNull(artistId: string): Promise<void> {
    await this.albumRepository
      .createQueryBuilder()
      .update(AlbumEntity)
      .set({ artistId: null })
      .where('artistId = :artistId', { artistId })
      .execute();
  }
  
  private validateUuid(id: string): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException('Invalid UUID');
    }
  }
}
