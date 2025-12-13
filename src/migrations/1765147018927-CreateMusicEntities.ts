import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMusicEntities1765147018927 implements MigrationInterface {
  name = 'CreateMusicEntities1765147018927';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS artists (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        grammy BOOLEAN NOT NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS albums (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        year INTEGER NOT NULL,
        artist_id UUID REFERENCES artists(id) ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS tracks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        duration INTEGER NOT NULL,
        artist_id UUID REFERENCES artists(id) ON DELETE SET NULL,
        album_id UUID REFERENCES albums(id) ON DELETE SET NULL
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS tracks`);
    await queryRunner.query(`DROP TABLE IF EXISTS albums`);
    await queryRunner.query(`DROP TABLE IF EXISTS artists`);
  }
}
