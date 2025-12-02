import { Controller, Get, Post, Delete, Param, HttpException, HttpStatus } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { validate as isUUID } from 'uuid';

@Controller('favs')
export class FavoritesController {
  
  @Get()
  findAll() {
    return FavoritesService.findAll();
  }

  @Post('track/:id')
  addTrack(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid track ID', HttpStatus.BAD_REQUEST);
    }

    const added = FavoritesService.addTrack(id);
    if (!added) {
      throw new HttpException('Track not found', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    throw new HttpException('Created', HttpStatus.CREATED);
  }

  @Delete('track/:id')
  removeTrack(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid track ID', HttpStatus.BAD_REQUEST);
    }

    const removed = FavoritesService.removeTrack(id);
    if (!removed) {
      throw new HttpException('Track not found in favorites', HttpStatus.NOT_FOUND);
    }

    throw new HttpException('No Content', HttpStatus.NO_CONTENT);
  }

  @Post('album/:id')
  addAlbum(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid album ID', HttpStatus.BAD_REQUEST);
    }

    const added = FavoritesService.addAlbum(id);
    if (!added) {
      throw new HttpException('Album not found', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    throw new HttpException('Created', HttpStatus.CREATED);
  }

  @Delete('album/:id')
  removeAlbum(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid album ID', HttpStatus.BAD_REQUEST); 
    }

    const removed = FavoritesService.removeAlbum(id);
    if (!removed) {
      throw new HttpException('Album not found in favorites', HttpStatus.NOT_FOUND);
    }

    throw new HttpException('No Content', HttpStatus.NO_CONTENT);
  }

  @Post('artist/:id')
  addArtist(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid artist ID', HttpStatus.BAD_REQUEST);
    }

    const added = FavoritesService.addArtist(id);
    if (!added) {
      throw new HttpException('Artist not found', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    throw new HttpException('Created', HttpStatus.CREATED);
  }

  @Delete('artist/:id')
  removeArtist(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid artist ID', HttpStatus.BAD_REQUEST);
    }

    const removed = FavoritesService.removeArtist(id);
    if (!removed) {
      throw new HttpException('Artist not found in favorites', HttpStatus.NOT_FOUND);
    }

    throw new HttpException('No Content', HttpStatus.NO_CONTENT); 
  }
}
