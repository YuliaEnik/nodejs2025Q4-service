import { Entity, ManyToMany, JoinTable, PrimaryColumn } from 'typeorm';
import { ArtistEntity } from '../artist/artist.entity';
import { AlbumEntity } from '../album/album.entity';
import { TrackEntity } from '../track/track.entity';

@Entity('favorites')
export class FavoritesEntity {
  @PrimaryColumn({ type: 'varchar', default: 'default' })
  id: string;

  @ManyToMany(() => ArtistEntity, { nullable: true, eager: true })
  @JoinTable({
    name: 'favorites_artists',
    joinColumn: { name: 'favoritesId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'artistsId', referencedColumnName: 'id' },
  })
  artists: ArtistEntity[];

  @ManyToMany(() => AlbumEntity, { nullable: true, eager: true })
  @JoinTable({
    name: 'favorites_albums',
    joinColumn: { name: 'favoritesId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'albumsId', referencedColumnName: 'id' },
  })
  albums: AlbumEntity[];

  @ManyToMany(() => TrackEntity, { nullable: true, eager: true })
  @JoinTable({
    name: 'favorites_tracks',
    joinColumn: { name: 'favoritesId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tracksId', referencedColumnName: 'id' },
  })
  tracks: TrackEntity[];
}
