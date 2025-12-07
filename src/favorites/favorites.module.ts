import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesEntity } from './favorites.entity';
import { AlbumModule } from '../album/album.module';
import { ArtistModule } from '../artist/artist.module';
import { TrackModule } from '../track/track.module';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FavoritesEntity]),
    ArtistModule,
    AlbumModule,
    TrackModule,
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
