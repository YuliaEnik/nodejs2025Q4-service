import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoritesEntity } from './favorites.entity';
import { FavoritesResponse } from './favorites.types';
import { ArtistEntity } from '../artist/artist.entity';
import { AlbumEntity } from '../album/album.entity';
import { TrackEntity } from '../track/track.entity';

@Injectable()
export class FavoritesService {
  private readonly favoritesId = 'default';

  constructor(
    @InjectRepository(FavoritesEntity)
    private favoritesRepository: Repository<FavoritesEntity>,
    @InjectRepository(ArtistEntity)
    private artistRepository: Repository<ArtistEntity>,
    @InjectRepository(AlbumEntity)
    private albumRepository: Repository<AlbumEntity>,
    @InjectRepository(TrackEntity)
    private trackRepository: Repository<TrackEntity>,
  ) {}

  async findAll(): Promise<FavoritesResponse> {
    console.log('Finding favorites...');
    try {
      const favorites = await this.getOrCreateFavorites();
      console.log('Favorites found:', favorites);
      return {
        artists: favorites.artists || [],
        albums: favorites.albums || [],
        tracks: favorites.tracks || [],
      };
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }
  async addArtist(id: string): Promise<void> {
    this.validateUuid(id);

    const artist = await this.artistRepository.findOneBy({ id });
    if (!artist) {
      throw new UnprocessableEntityException('Artist not found');
    }

    const favorites = await this.getOrCreateFavorites();

    const existingArtist = favorites.artists?.find((a) => a.id === id);
    if (!existingArtist) {
      if (!favorites.artists) favorites.artists = [];
      favorites.artists.push(artist);
      await this.favoritesRepository.save(favorites);
    }
  }

  async addAlbum(id: string): Promise<void> {
    this.validateUuid(id);

    const album = await this.albumRepository.findOneBy({ id });
    if (!album) {
      throw new UnprocessableEntityException('Album not found');
    }

    const favorites = await this.getOrCreateFavorites();

    const existingAlbum = favorites.albums?.find((a) => a.id === id);
    if (!existingAlbum) {
      if (!favorites.albums) favorites.albums = [];
      favorites.albums.push(album);
      await this.favoritesRepository.save(favorites);
    }
  }

  async addTrack(id: string): Promise<void> {
    this.validateUuid(id);

    const track = await this.trackRepository.findOneBy({ id });
    if (!track) {
      throw new UnprocessableEntityException('Track not found');
    }

    const favorites = await this.getOrCreateFavorites();

    const existingTrack = favorites.tracks?.find((t) => t.id === id);
    if (!existingTrack) {
      if (!favorites.tracks) favorites.tracks = [];
      favorites.tracks.push(track);
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeArtist(id: string): Promise<void> {
    this.validateUuid(id);

    const favorites = await this.getOrCreateFavorites();

    if (!favorites.artists) {
      throw new NotFoundException('Artist is not in favorites');
    }

    const index = favorites.artists.findIndex((artist) => artist.id === id);
    if (index === -1) {
      throw new NotFoundException('Artist is not in favorites');
    }

    favorites.artists.splice(index, 1);
    await this.favoritesRepository.save(favorites);
  }

  async removeAlbum(id: string): Promise<void> {
    this.validateUuid(id);

    const favorites = await this.getOrCreateFavorites();

    if (!favorites.albums) {
      throw new NotFoundException('Album is not in favorites');
    }

    const index = favorites.albums.findIndex((album) => album.id === id);
    if (index === -1) {
      throw new NotFoundException('Album is not in favorites');
    }

    favorites.albums.splice(index, 1);
    await this.favoritesRepository.save(favorites);
  }

  async removeTrack(id: string): Promise<void> {
    this.validateUuid(id);

    const favorites = await this.getOrCreateFavorites();

    if (!favorites.tracks) {
      throw new NotFoundException('Track is not in favorites');
    }

    const index = favorites.tracks.findIndex((track) => track.id === id);
    if (index === -1) {
      throw new NotFoundException('Track is not in favorites');
    }

    favorites.tracks.splice(index, 1);
    await this.favoritesRepository.save(favorites);
  }

  private async getOrCreateFavorites(): Promise<FavoritesEntity> {
    let favorites = await this.favoritesRepository.findOne({
      where: { id: this.favoritesId },
      relations: ['artists', 'albums', 'tracks'],
    });

    if (!favorites) {
      favorites = this.favoritesRepository.create({
        id: this.favoritesId,
        artists: [],
        albums: [],
        tracks: [],
      });
      await this.favoritesRepository.save(favorites);
    }

    return favorites;
  }

  private validateUuid(id: string): void {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException('Invalid UUID');
    }
  }
}
