import * as argon from 'argon2';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: { email: dto.email, hash },
      });
      const { hash: _, ...cleanUser } = user;
      return cleanUser;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already in use');
        }
      }
      throw error;
    }
  }
  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Invalid credentials');
    const isMatch = await argon.verify(user.hash, dto.password);
    if (!isMatch) throw new ForbiddenException('Invalid credentials');
    const { id, email } = user;
    return this.signToken(id, email);
  }
  async signToken(userId: number, email: string) {
    const payload = { sub: userId, email };
    return {
      access_token: await this.jwt.signAsync(payload, {
        expiresIn: '15m',
        secret: this.config.get('JWT_SECRET'),
      }),
    };
  }
}
