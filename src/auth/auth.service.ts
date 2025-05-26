import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    // Initialize Prisma service or any other dependencies here
    // this.prismaService = new PrismaService();
  }

  async convertToJWT(register: RegisterDTO): Promise<{accessToken: string}> {
    const payload = {
      email: register.email,
      name: register.name,
      dateOfBirth: register.dateOfBirth,
    };
    const jwtToken = await this.jwtService.signAsync(payload, {
      expiresIn: '12h',
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    return {
        accessToken: jwtToken
    }
  }

  // Example method to demonstrate functionality
  async register(register: RegisterDTO): Promise<any> {
    const existingEmail = await this.prismaService.account.findUnique({
      where: { email: register.email },
    });
    if (existingEmail) {
      throw new Error('Email already exists, please use a different email');
    }
    const newUser = await this.prismaService.user.create({
      data: {
        name: register.name,
        dateOfBirth: register.dateOfBirth,
      },
    });
    await this.prismaService.account.create({
      data: {
        email: register.email,
        hashPassword: register.password,
        userId: newUser.id,
        roleId: 'user',
      },
    });

    return { message: 'Registration successful' };
  }

  async login(login: LoginDTO): Promise<any> {
    const existingAccount = await this.prismaService.account.findUnique({
      where: { email: login.email },
    });

    if (!existingAccount) {
      throw new Error('Account not found');
    }

    if (existingAccount.hashPassword !== login.password) {
      throw new Error('Invalid password');
    }
    if (existingAccount) {
      const user = await this.prismaService.user.findUnique({
        where: { id: existingAccount.userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const plainDTO = plainToInstance(RegisterDTO, {
        email: existingAccount.email,
        ...user,
      });

      const token = await this.convertToJWT(plainDTO);

      return {
        message: 'Login successful',
        accessToken: token,
      };
    } else {
      throw new Error('Login failed');
    }
  }

  async loginByGG(login: LoginDTO): Promise<any> {

  }
}
