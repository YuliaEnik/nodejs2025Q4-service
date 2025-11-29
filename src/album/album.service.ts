import { v4 as uuidv4 } from 'uuid';
import { Album, CreateAlbumDto, UpdateAlbumDto } from './album.types';

const albums: Album[] = [];

export const AlbumService = {
  findAll(): Album[] {
    return albums;
  },

  findById(id: string): Album | null {
    return albums.find((album) => album.id === id) || null;
  },

  create(createAlbumDto: CreateAlbumDto): Album {
    const newAlbum: Album = {
      id: uuidv4(), 
      ...createAlbumDto, 
    };

    albums.push(newAlbum); 
    return newAlbum; 
  },

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album | null {
    const albumIndex = albums.findIndex((album) => album.id === id);
    if (albumIndex === -1) return null;

    const updatedAlbum: Album = {
      ...albums[albumIndex],
      ...updateAlbumDto,
    };

    albums[albumIndex] = updatedAlbum;
    return updatedAlbum;
  },

  delete(id: string): boolean {
    const albumIndex = albums.findIndex((album) => album.id === id);
    if (albumIndex === -1) return false;

    albums.splice(albumIndex, 1);
    return true;
  },
};
