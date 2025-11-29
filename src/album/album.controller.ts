import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto, UpdateAlbumDto } from './album.types';
import { validate as isUUID } from 'uuid';

@Controller('album')
export class AlbumController {
  
  @Get() 
  findAll() {
    return AlbumService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid album ID', HttpStatus.BAD_REQUEST);
    }

    const album = AlbumService.findById(id);
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    return album;
  }

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto) {

    if (!createAlbumDto.name || !createAlbumDto.year) {
      throw new HttpException('Name and year are required', HttpStatus.BAD_REQUEST);
    }

    if (typeof createAlbumDto.year !== 'number') {
      throw new HttpException('Year must be a number', HttpStatus.BAD_REQUEST);
    }

    return AlbumService.create(createAlbumDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid album ID', HttpStatus.BAD_REQUEST);
    }

    if (!updateAlbumDto.name || !updateAlbumDto.year) {
      throw new HttpException('Name and year are required', HttpStatus.BAD_REQUEST);
    }

    if (typeof updateAlbumDto.year !== 'number') {
      throw new HttpException('Year must be a number', HttpStatus.BAD_REQUEST);
    }

    const updatedAlbum = AlbumService.update(id, updateAlbumDto);
    
    if (!updatedAlbum) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    return updatedAlbum;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid album ID', HttpStatus.BAD_REQUEST);
    }

    const deleted = AlbumService.delete(id);
    if (!deleted) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
  }
}
