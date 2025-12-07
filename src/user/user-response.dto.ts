import { Expose, Transform } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  login: string;

  @Expose()
  version: number;

  @Expose()
  @Transform(({ value }) => new Date(value).getTime())
  createdAt: Date;

  @Expose()
  @Transform(({ value }) => new Date(value).getTime())
  updatedAt: Date;
}
