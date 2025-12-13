DROP TABLE IF EXISTS favorites_tracks CASCADE;
DROP TABLE IF EXISTS favorites_albums CASCADE;
DROP TABLE IF EXISTS favorites_artists CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS tracks CASCADE;
DROP TABLE IF EXISTS albums CASCADE;
DROP TABLE IF EXISTS artists CASCADE;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  login VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  grammy BOOLEAN NOT NULL
);

CREATE TABLE albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE SET NULL
);

CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  duration INTEGER NOT NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE SET NULL,
  album_id UUID REFERENCES albums(id) ON DELETE SET NULL
);

CREATE TABLE favorites (
  id VARCHAR(255) PRIMARY KEY DEFAULT 'default'
);

CREATE TABLE favorites_artists (
  favoritesId VARCHAR(255) REFERENCES favorites(id) ON DELETE CASCADE,
  artistsId UUID REFERENCES artists(id) ON DELETE CASCADE,
  PRIMARY KEY (favoritesId, artistsId)
);

CREATE TABLE favorites_albums (
  favoritesId VARCHAR(255) REFERENCES favorites(id) ON DELETE CASCADE,
  albumsId UUID REFERENCES albums(id) ON DELETE CASCADE,
  PRIMARY KEY (favoritesId, albumsId)
);

CREATE TABLE favorites_tracks (
  favoritesId VARCHAR(255) REFERENCES favorites(id) ON DELETE CASCADE,
  tracksId UUID REFERENCES tracks(id) ON DELETE CASCADE,
  PRIMARY KEY (favoritesId, tracksId)
);

INSERT INTO favorites (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;

TRUNCATE migrations;
INSERT INTO migrations (timestamp, name) VALUES 
  (1712345678901, 'CreateUsersTable1712345678901'),
  (1765147018926, '1765147018926-CreateFavoritesTables');
  