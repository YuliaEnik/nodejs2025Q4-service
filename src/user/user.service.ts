import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdatePasswordDto, UserResponse } from './user.types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserResponse[]> {
    const users = await this.userRepository.find();
    return users.map((user) => this.mapToResponse(user));
  }

  async findById(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.mapToResponse(user);
  }

  async findByIdWithPassword(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findByLogin(login: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { login } });
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const existingUser = await this.findByLogin(createUserDto.login);
    if (existingUser) {
      throw new ConflictException('User with this login already exists');
    }

    const saltRounds = parseInt(process.env.CRYPT_SALT) || 10;
    const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);

    const newUser = this.userRepository.create({
      login: createUserDto.login,
      passwordHash,
      version: 1,
    });

    const savedUser = await this.userRepository.save(newUser);
    return this.mapToResponse(savedUser);
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponse> {
    const user = await this.findByIdWithPassword(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isOldPasswordValid = await bcrypt.compare(
      updatePasswordDto.oldPassword,
      user.passwordHash,
    );

    if (!isOldPasswordValid) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const saltRounds = parseInt(process.env.CRYPT_SALT) || 10;
    user.passwordHash = await bcrypt.hash(
      updatePasswordDto.newPassword,
      saltRounds,
    );
    user.version += 1;

    const updatedUser = await this.userRepository.save(user);
    return this.mapToResponse(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async validateUser(
    login: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.findByLogin(login);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    return isPasswordValid ? user : null;
  }

  private mapToResponse(user: UserEntity): UserResponse {
    const { ...rest } = user;
    return {
      ...rest,
      createdAt: new Date(user.createdAt).getTime(),
      updatedAt: new Date(user.updatedAt).getTime(),
    };
  }
}
