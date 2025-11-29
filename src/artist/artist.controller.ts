import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto, UpdateArtistDto } from './artist.types';
import { validate as isUUID } from 'uuid';

@Controller('artist')
export class ArtistController {
  @Get()
  findAll() {
    return ArtistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid artist ID', HttpStatus.BAD_REQUEST);
    }

    const artist = ArtistService.findById(id);
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    return artist;
  }

  @Post()
  @HttpCode(201)  
  create(@Body() createArtistDto: CreateArtistDto) {
    if (!createArtistDto.name || typeof createArtistDto.grammy !== 'boolean') {
      throw new HttpException('Name and grammy are required', HttpStatus.BAD_REQUEST);
    }

    return ArtistService.create(createArtistDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid artist ID', HttpStatus.BAD_REQUEST);
    }

    if (!updateArtistDto.name || typeof updateArtistDto.grammy !== 'boolean') {
      throw new HttpException('Name and grammy are required', HttpStatus.BAD_REQUEST);
    }

    const updatedArtist = ArtistService.update(id, updateArtistDto);
    
    if (!updatedArtist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    return updatedArtist;
  }

  @Delete(':id')
  @HttpCode(204) 
  remove(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid artist ID', HttpStatus.BAD_REQUEST);
    }

    const deleted = ArtistService.delete(id);
    if (!deleted) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
  }
}
