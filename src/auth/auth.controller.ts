import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return "Hello World!hihi";
  }

  @Post("register")
  register(@Body() body: RegisterDTO) {
    return this.authService.register(body);
  }
  @Post("login")
  login(@Body() body: LoginDTO) {
    return this.authService.login(body);
  }

}
