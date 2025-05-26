import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthController } from './auth.controller';
import { JWTStrategy } from './strategy';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule.register({
  })],
  controllers: [AuthController],
  providers: [PrismaService, JWTStrategy, AuthService],
})
export class AuthModule {}
