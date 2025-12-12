import { IsString, IsNotEmpty, Length } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  login: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 255)
  password: string;
}
