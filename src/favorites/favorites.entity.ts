import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('favorites')
export class FavoritesEntity {
  @PrimaryColumn({ type: 'varchar', default: 'default' })
  id: string = 'default';

  @Column({ type: 'simple-array', default: '' })
  artists: string[];

  @Column({ type: 'simple-array', default: '' })
  albums: string[];

  @Column({ type: 'simple-array', default: '' })
  tracks: string[];
}
