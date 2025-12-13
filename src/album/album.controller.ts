import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto, UpdateAlbumDto } from './album.types';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('album')
@UseGuards(JwtAuthGuard)
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  async findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.albumService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    if (typeof updateAlbumDto.year !== 'number') {
      throw new BadRequestException('Year must be a number');
    }
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.albumService.delete(id);
  }
}
