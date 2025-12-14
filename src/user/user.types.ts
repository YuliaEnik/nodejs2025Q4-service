export interface User {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export interface CreateUserDto {
  login: string;
  password: string;
}

export interface UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface JwtPayload {
  sub: string;
  login: string;
  type: string;
}

export interface AuthUser {
  id: string;
  login: string;
}

export type UserResponse = Omit<User, 'password'>;
