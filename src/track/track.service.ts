import { v4 as uuidv4 } from 'uuid';
import { Track, CreateTrackDto, UpdateTrackDto } from './track.types';
import { FavoritesService } from 'src/favorites/favorites.service';

const tracks: Track[] = [];

export const TrackService = {

  findAll(): Track[] {
    return tracks; 
  },

  findById(id: string): Track | null {
    return tracks.find((track) => track.id === id) || null;
  },

  create(createTrackDto: CreateTrackDto): Track {
    const newTrack: Track = {
      id: uuidv4(),
      ...createTrackDto,
    };
    tracks.push(newTrack);
    return newTrack;
  },

  update(id: string, updateTrackDto: UpdateTrackDto): Track | null {
    const trackIndex = tracks.findIndex((track) => track.id === id);
    if (trackIndex === -1) return null; 
    const updatedTrack: Track = {
      ...tracks[trackIndex],
      ...updateTrackDto, 
    };
    tracks[trackIndex] = updatedTrack; 
    return updatedTrack; 
  },

  delete(id: string): boolean {
    const trackIndex = tracks.findIndex((track) => track.id === id);
    if (trackIndex === -1) return false;

    FavoritesService.removeTrack(id);
    
    tracks.splice(trackIndex, 1); 
    return true; 
  },

  setArtistIdToNull(artistId: string): void {
    tracks.forEach(track => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });
  },

  setAlbumIdToNull(albumId: string): void {
    tracks.forEach(track => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });
  },
};
