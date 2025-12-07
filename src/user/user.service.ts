import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdatePasswordDto, UserResponse } from './user.types';

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

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const newUser = this.userRepository.create({
      ...createUserDto,
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

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    user.password = updatePasswordDto.newPassword;
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

  private mapToResponse(user: UserEntity): UserResponse {
    const { password: _, ...rest } = user;
    return {
      ...rest,
      createdAt: new Date(user.createdAt).getTime(),
      updatedAt: new Date(user.updatedAt).getTime(),
    };
  }
}
