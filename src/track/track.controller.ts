import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto, UpdateTrackDto } from './track.types';
import { validate as isUUID } from 'uuid';

@Controller('track')
export class TrackController {
  
  @Get() 
  findAll() {
    return TrackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid track ID', HttpStatus.BAD_REQUEST);
    }
    const track = TrackService.findById(id);
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    return track;
  }

  @Post() 
  create(@Body() createTrackDto: CreateTrackDto) {
    if (!createTrackDto.name || !createTrackDto.duration) {
      throw new HttpException('Name and duration are required', HttpStatus.BAD_REQUEST);
    }
    if (typeof createTrackDto.duration !== 'number') {
      throw new HttpException('Duration must be a number', HttpStatus.BAD_REQUEST);
    }
    return TrackService.create(createTrackDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {

    if (!isUUID(id)) {
      throw new HttpException('Invalid track ID', HttpStatus.BAD_REQUEST);
    }

    if (!updateTrackDto.name || !updateTrackDto.duration) {
      throw new HttpException('Name and duration are required', HttpStatus.BAD_REQUEST);
    }

    if (typeof updateTrackDto.duration !== 'number') {
      throw new HttpException('Duration must be a number', HttpStatus.BAD_REQUEST);
    }

    const updatedTrack = TrackService.update(id, updateTrackDto);
    
    if (!updatedTrack) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    return updatedTrack;
  }

  @Delete(':id')  
  remove(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid track ID', HttpStatus.BAD_REQUEST);
    }
    const deleted = TrackService.delete(id);
    if (!deleted) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
  }
}
