import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { Favorites, FavoritesResponse } from './favorites.types';

let favorites: Favorites = {
  artists: [],
  albums: [], 
  tracks: []
};

export const FavoritesService = {
  findAll(): FavoritesResponse {

    const favoriteArtists = favorites.artists
      .map(id => ArtistService.findById(id))
      .filter(artist => artist !== null);

    const favoriteAlbums = favorites.albums
      .map(id => AlbumService.findById(id))  
      .filter(album => album !== null);

    const favoriteTracks = favorites.tracks
      .map(id => TrackService.findById(id))
      .filter(track => track !== null);

    return {
      artists: favoriteArtists,
      albums: favoriteAlbums,
      tracks: favoriteTracks
    };
  },

  addArtist(id: string): boolean {

    const artist = ArtistService.findById(id);
    if (!artist) return false;

    if (!favorites.artists.includes(id)) {
      favorites.artists.push(id);
    }
    
    return true;
  },
  
  addAlbum(id: string): boolean {
    const album = AlbumService.findById(id);
    if (!album) return false;

    if (!favorites.albums.includes(id)) {
      favorites.albums.push(id);
    }
    
    return true;
  },

  addTrack(id: string): boolean {
    const track = TrackService.findById(id);
    if (!track) return false;

    if (!favorites.tracks.includes(id)) {
      favorites.tracks.push(id);
    }
    
    return true;
  },

  removeArtist(id: string): boolean {
    const index = favorites.artists.indexOf(id);
    if (index === -1) return false; 
    favorites.artists.splice(index, 1);
    return true;
  },

  removeAlbum(id: string): boolean {
    const index = favorites.albums.indexOf(id);
    if (index === -1) return false;

    favorites.albums.splice(index, 1);
    return true;
  },
 
  removeTrack(id: string): boolean {
    const index = favorites.tracks.indexOf(id);
    if (index === -1) return false;

    favorites.tracks.splice(index, 1);
    return true;
  }
};
