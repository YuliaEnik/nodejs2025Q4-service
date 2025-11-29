import { v4 as uuidv4 } from 'uuid';
import {
  User,
  CreateUserDto,
  UpdatePasswordDto,
  UserResponse,
} from './user.types';

const users: User[] = [];

export const UserService = {
  findAll(): UserResponse[] {
    return users.map(({ password: _, ...user }) => user);
  },

  findById(id: string): UserResponse | null {
    const user = users.find((user) => user.id === id);
    if (!user) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  findByIdWithPassword(id: string): User | null {
    return users.find((user) => user.id === id) || null;
  },

  create(createUserDto: CreateUserDto): UserResponse {
    const now = Date.now();
    const newUser: User = {
      id: uuidv4(),
      ...createUserDto,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    users.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): UserResponse | null {
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) return null;

    const user = users[userIndex];

    if (user.password !== updatePasswordDto.oldPassword) {
      return null;
    }

    const updatedUser: User = {
      ...user,
      password: updatePasswordDto.newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    };

    users[userIndex] = updatedUser;

    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  },

  delete(id: string): boolean {
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) return false;

    users.splice(userIndex, 1);
    return true;
  },
};
