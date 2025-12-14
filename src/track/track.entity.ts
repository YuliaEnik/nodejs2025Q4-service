import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tracks')
export class TrackEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'artist_id', type: 'uuid', nullable: true })
  artistId: string | null;

  @Column({ name: 'album_id', type: 'uuid', nullable: true })
  albumId: string | null;

  @Column({ type: 'int' })
  duration: number;
}
