import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { RefreshDto } from './dto/refresh.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TokensDto } from './dto/tokens.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshTokenEntity)
    private refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  async signup(signupDto: SignupDto): Promise<{ message: string }> {
    try {
      await this.userService.create(signupDto);
      return { message: 'User created successfully' };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async login(loginDto: LoginDto): Promise<TokensDto> {
    const user = await this.userService.validateUser(
      loginDto.login,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async refresh(refreshDto: RefreshDto): Promise<TokensDto> {
    const refreshToken = await this.validateRefreshToken(
      refreshDto.refreshToken,
    );

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.refreshTokenRepository.delete(refreshToken.id);

    return this.generateTokens(refreshToken.user);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenRepository.delete({ token: refreshToken });
  }

  private async generateTokens(user: UserEntity): Promise<TokensDto> {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken: refreshToken.token,
    };
  }

  private generateAccessToken(user: UserEntity): string {
    const payload = {
      sub: user.id,
      login: user.login,
      type: 'access',
    };
    const expiresIn = process.env.TOKEN_EXPIRE_TIME || '1h';
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: expiresIn,
    });
  }

  private async generateRefreshToken(
    user: UserEntity,
  ): Promise<RefreshTokenEntity> {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(
      expiresAt.getHours() +
        parseInt(
          process.env.TOKEN_REFRESH_EXPIRE_TIME?.replace('h', '') || '24',
        ),
    );

    const refreshToken = this.refreshTokenRepository.create({
      token,
      userId: user.id,
      expiresAt,
    });

    return this.refreshTokenRepository.save(refreshToken);
  }

  private async validateRefreshToken(
    token: string,
  ): Promise<RefreshTokenEntity | null> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      return null;
    }

    return refreshToken;
  }

  async validateAccessToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
    } catch (error) {
      return null;
    }
  }
}
