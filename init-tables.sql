-- 1. users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  login VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. artists
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  grammy BOOLEAN NOT NULL
);

-- 3. albums  
CREATE TABLE IF NOT EXISTS albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  artistId UUID REFERENCES artists(id) ON DELETE SET NULL
);

-- 4. tracks
CREATE TABLE IF NOT EXISTS tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  duration INTEGER NOT NULL,
  artistId UUID REFERENCES artists(id) ON DELETE SET NULL,
  albumId UUID REFERENCES albums(id) ON DELETE SET NULL
);

-- 5. favorites
CREATE TABLE IF NOT EXISTS favorites (
  id VARCHAR(255) PRIMARY KEY DEFAULT 'default'
);

-- 6. favorites_artists
CREATE TABLE IF NOT EXISTS favorites_artists (
  "favoritesId" VARCHAR(255) REFERENCES favorites(id) ON DELETE CASCADE,
  "artistsId" UUID REFERENCES artists(id) ON DELETE CASCADE,
  PRIMARY KEY ("favoritesId", "artistsId")
);

-- 7. favorites_albums
CREATE TABLE IF NOT EXISTS favorites_albums (
  "favoritesId" VARCHAR(255) REFERENCES favorites(id) ON DELETE CASCADE,
  "albumsId" UUID REFERENCES albums(id) ON DELETE CASCADE,
  PRIMARY KEY ("favoritesId", "albumsId")
);

-- 8. favorites_tracks
CREATE TABLE IF NOT EXISTS favorites_tracks (
  "favoritesId" VARCHAR(255) REFERENCES favorites(id) ON DELETE CASCADE,
  "tracksId" UUID REFERENCES tracks(id) ON DELETE CASCADE,
  PRIMARY KEY ("favoritesId", "tracksId")
);
