import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { ArtistEntity } from '../artist/artist.entity';
import { AlbumEntity } from '../album/album.entity';
import { TrackEntity } from '../track/track.entity';

@Entity('favorites')
export class FavoritesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => ArtistEntity)
  @JoinTable({
    name: 'favorites_artists',
    joinColumn: { name: 'favoritesId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'artistsId', referencedColumnName: 'id' },
  })
  artists: ArtistEntity[];

  @ManyToMany(() => AlbumEntity)
  @JoinTable({
    name: 'favorites_albums',
    joinColumn: { name: 'favoritesId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'albumsId', referencedColumnName: 'id' },
  })
  albums: AlbumEntity[];

  @ManyToMany(() => TrackEntity)
  @JoinTable({
    name: 'favorites_tracks',
    joinColumn: { name: 'favoritesId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tracksId', referencedColumnName: 'id' },
  })
  tracks: TrackEntity[];
}
