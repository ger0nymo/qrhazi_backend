import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  HttpException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('register')
  async signUp(@Body() signUpDto: Record<string, any>) {
    const user = await this.authService.signUp(
      signUpDto.username,
      signUpDto.password,
      signUpDto.email,
    );
    if (!user) {
      throw new HttpException(
        'User already exists with this username.',
        HttpStatus.CONFLICT,
      );
    }
    return user;
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
