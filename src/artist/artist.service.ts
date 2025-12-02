import { v4 as uuidv4 } from 'uuid';
import { Artist, CreateArtistDto, UpdateArtistDto } from './artist.types';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { FavoritesService } from '../favorites/favorites.service';

const artists: Artist[] = [];

export const ArtistService = {
  findAll(): Artist[] {
    return artists;
  },

  findById(id: string): Artist | null {
    return artists.find((artist) => artist.id === id) || null;
  },

  create(createArtistDto: CreateArtistDto): Artist {
    const newArtist: Artist = {
      id: uuidv4(),
      ...createArtistDto,
    };

    artists.push(newArtist);
    return newArtist;
  },

  update(id: string, updateArtistDto: UpdateArtistDto): Artist | null {
    const artistIndex = artists.findIndex((artist) => artist.id === id);
    if (artistIndex === -1) return null;

    const updatedArtist: Artist = {
      ...artists[artistIndex],
      ...updateArtistDto,
    };

    artists[artistIndex] = updatedArtist;
    return updatedArtist;
  },

  delete(id: string): boolean {
    const artistIndex = artists.findIndex((artist) => artist.id === id);
    if (artistIndex === -1) return false;

    TrackService.setArtistIdToNull(id);
    AlbumService.setArtistIdToNull(id);
    FavoritesService.removeArtist(id);

    artists.splice(artistIndex, 1);
    return true;
  },
};
