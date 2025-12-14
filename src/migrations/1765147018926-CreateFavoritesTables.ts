import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFavoritesTables1765145764444 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const favoritesTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'favorites'
      )
    `);
    if (!favoritesTableExists[0].exists) {
      await queryRunner.query(`
        CREATE TABLE favorites (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid()
        )
      `);
    }

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS favorites_artists (
        "favoritesId" UUID REFERENCES favorites(id) ON DELETE CASCADE,
        "artistsId" UUID REFERENCES artists(id) ON DELETE CASCADE,
        PRIMARY KEY ("favoritesId", "artistsId")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS favorites_albums (
        "favoritesId" UUID REFERENCES favorites(id) ON DELETE CASCADE,
        "albumsId" UUID REFERENCES albums(id) ON DELETE CASCADE,
        PRIMARY KEY ("favoritesId", "albumsId")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS favorites_tracks (
        "favoritesId" UUID REFERENCES favorites(id) ON DELETE CASCADE,
        "tracksId" UUID REFERENCES tracks(id) ON DELETE CASCADE,
        PRIMARY KEY ("favoritesId", "tracksId")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS favorites_tracks`);
    await queryRunner.query(`DROP TABLE IF EXISTS favorites_albums`);
    await queryRunner.query(`DROP TABLE IF EXISTS favorites_artists`);
    await queryRunner.query(`DROP TABLE IF EXISTS favorites`);
  }
}
