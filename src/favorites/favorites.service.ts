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
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';

@Injectable()
export class FavoritesService {
  private readonly favoritesId = 'default';

  constructor(
    @InjectRepository(FavoritesEntity)
    private favoritesRepository: Repository<FavoritesEntity>,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  async findAll(): Promise<FavoritesResponse> {
    let favorites = await this.favoritesRepository.findOneBy({
      id: this.favoritesId,
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

    const favoriteArtists = await Promise.all(
      favorites.artists.map((id) =>
        this.artistService.findById(id).catch(() => null),
      ),
    );

    const favoriteAlbums = await Promise.all(
      favorites.albums.map((id) =>
        this.albumService.findById(id).catch(() => null),
      ),
    );

    const favoriteTracks = await Promise.all(
      favorites.tracks.map((id) =>
        this.trackService.findById(id).catch(() => null),
      ),
    );

    return {
      artists: favoriteArtists.filter((artist) => artist !== null),
      albums: favoriteAlbums.filter((album) => album !== null),
      tracks: favoriteTracks.filter((track) => track !== null),
    };
  }

  async addArtist(id: string): Promise<void> {
    this.validateUuid(id);

    try {
      await this.artistService.findById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException('Artist not found');
      }
      throw error;
    }

    const favorites = await this.getOrCreateFavorites();

    if (!favorites.artists.includes(id)) {
      favorites.artists.push(id);
      await this.favoritesRepository.save(favorites);
    }
  }

  async addAlbum(id: string): Promise<void> {
    this.validateUuid(id);

    try {
      await this.albumService.findById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException('Album not found');
      }
      throw error;
    }

    const favorites = await this.getOrCreateFavorites();

    if (!favorites.albums.includes(id)) {
      favorites.albums.push(id);
      await this.favoritesRepository.save(favorites);
    }
  }

  async addTrack(id: string): Promise<void> {
    this.validateUuid(id);

    try {
      await this.trackService.findById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException('Track not found');
      }
      throw error;
    }

    const favorites = await this.getOrCreateFavorites();

    if (!favorites.tracks.includes(id)) {
      favorites.tracks.push(id);
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeArtist(id: string): Promise<void> {
    this.validateUuid(id);

    const favorites = await this.getOrCreateFavorites();
    const index = favorites.artists.indexOf(id);

    if (index === -1) {
      throw new NotFoundException('Artist is not in favorites');
    }

    favorites.artists.splice(index, 1);
    await this.favoritesRepository.save(favorites);
  }

  async removeAlbum(id: string): Promise<void> {
    this.validateUuid(id);

    const favorites = await this.getOrCreateFavorites();
    const index = favorites.albums.indexOf(id);

    if (index === -1) {
      throw new NotFoundException('Album is not in favorites');
    }

    favorites.albums.splice(index, 1);
    await this.favoritesRepository.save(favorites);
  }

  async removeTrack(id: string): Promise<void> {
    this.validateUuid(id);

    const favorites = await this.getOrCreateFavorites();
    const index = favorites.tracks.indexOf(id);

    if (index === -1) {
      throw new NotFoundException('Track is not in favorites');
    }

    favorites.tracks.splice(index, 1);
    await this.favoritesRepository.save(favorites);
  }

  private async getOrCreateFavorites(): Promise<FavoritesEntity> {
    let favorites = await this.favoritesRepository.findOneBy({
      id: this.favoritesId,
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

  async cleanupTrack(id: string): Promise<void> {
    const favorites = await this.getOrCreateFavorites();
    const index = favorites.tracks.indexOf(id);

    if (index !== -1) {
      favorites.tracks.splice(index, 1);
      await this.favoritesRepository.save(favorites);
    }
  }
}
