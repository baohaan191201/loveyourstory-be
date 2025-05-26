import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
    @UseGuards(AuthGuard('jwt'))
    // This guard will use the JWT strategy to protect the route
    // Ensure that the JWT strategy is properly configured in your application
    @Get()
    getUser(): string {
        return 'User data';
    }
}
