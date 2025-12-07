import { Artist } from '../artist/artist.types';
import { Album } from '../album/album.types';
import { Track } from '../track/track.types';

export interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
