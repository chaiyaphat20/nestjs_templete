import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { TokenPayload, Tokens } from '../../common/interfaces/token-payload.interface';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Tokens> {
    const { username, email, password, fullName } = registerDto;

    // ตรวจสอบว่า username หรือ email ถูกใช้ไปแล้วหรือไม่
    const userExists = await this.prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (userExists) {
      throw new ForbiddenException('Username or email already exists');
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await this.hashData(password);

    // สร้างผู้ใช้ใหม่
    const newUser = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        fullName,
      },
    });

    // สร้าง tokens
    const tokens = await this.getTokens(newUser.id, newUser.username);
    // บันทึก refresh token
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);

    return tokens;
  }

  async login(loginDto: LoginDto): Promise<Tokens> {
    const { username, password } = loginDto;

    // หาผู้ใช้จาก username
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // ตรวจสอบรหัสผ่าน
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // สร้าง tokens
    const tokens = await this.getTokens(user.id, user.username);
    // บันทึก refresh token
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string): Promise<boolean> {
    // ลบ refresh token เมื่อ logout
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return true;
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    // หาผู้ใช้จาก ID
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access denied');
    }

    // ตรวจสอบ refresh token
    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access denied');
    }

    // สร้าง tokens ใหม่
    const tokens = await this.getTokens(user.id, user.username);
    // บันทึก refresh token ใหม่
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    // เข้ารหัส refresh token
    const hashedRefreshToken = await this.hashData(refreshToken);
    // บันทึก refresh token ลงในฐานข้อมูล
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async getTokens(userId: string, username: string): Promise<Tokens> {
    const payload: TokenPayload = {
      sub: userId,
      username,
    };

    // สร้าง access token
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET') || 'access-secret',
      expiresIn: '15m', // อายุของ access token 15 นาที
    });

    // สร้าง refresh token
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh-secret',
      expiresIn: '7d', // อายุของ refresh token 7 วัน
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async hashData(data: string): Promise<string> {
    // เข้ารหัสข้อมูลด้วย bcrypt
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { ...result } = user;
      return result;
    }
    return null;
  }
}
