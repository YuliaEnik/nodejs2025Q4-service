import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto, UpdateTrackDto } from './track.types';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get() 
  async findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.trackService.findById(id);
  }

  @Post() 
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTrackDto: CreateTrackDto) {
    if (!createTrackDto.name || !createTrackDto.duration) {
      throw new BadRequestException('Name and duration are required');
    }
    if (typeof createTrackDto.duration !== 'number') {
      throw new BadRequestException('Duration must be a number');
    }
    return this.trackService.create(createTrackDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    if (!updateTrackDto.name || !updateTrackDto.duration) {
      throw new BadRequestException('Name and duration are required');
    }
    if (typeof updateTrackDto.duration !== 'number') {
      throw new BadRequestException('Duration must be a number');
    }
    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')  
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.trackService.delete(id);
  }
}
