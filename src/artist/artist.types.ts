export interface Artist {
  id: string;
  name: string;
  grammy: boolean;
}

export interface CreateArtistDto {
  name: string;
  grammy: boolean;
}

export interface UpdateArtistDto {
  name: string;
  grammy: boolean;
}
