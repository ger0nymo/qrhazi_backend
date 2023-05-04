import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  HttpStatus,
  HttpCode,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { Request } from 'express';
import { UsersService } from './../users/users.service';

@Injectable()
export class QRGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      if (payload.hasOwnProperty('isQrCode') === false) {
        request.invalidQrCode = true;
      }

      if (payload.hasOwnProperty('direction') === false) {
        request.invalidQrCode = true;
      }

      let user = await this.usersService.findOneByName(payload.username);

      if (!user) {
        throw new HttpException('Invalid QR code.', HttpStatus.BAD_REQUEST);
      }

      if (payload.direction === false && user.isIn === false) {
        throw new HttpException(
          'You have to enter first.',
          HttpStatus.BAD_REQUEST
        );
      }

      if (payload.direction === true && user.isIn === true) {
        throw new HttpException(
          'You have to exit first.',
          HttpStatus.BAD_REQUEST
        );
      }

      const updateUserIsIn = await this.usersService.updateIsIn(
        user.username,
        payload.direction
      );
      request.direction = payload.direction;
      request.user = user;
    } catch (e) {
      console.log('asdasdasdasd: ', e);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
