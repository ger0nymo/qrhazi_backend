import { Injectable } from '@nestjs/common';
import QRCode from 'qrcode';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from './../users/user.entity';

@Injectable()
export class QrService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService
  ) {}

  async generateQR(name: string, direction: boolean) {
    const payload = { username: name, isQrCode: true, direction: direction };
    const qrCode = await this.jwtService.signAsync(payload);
    console.log('qrCode: ', qrCode);
    return {
      qrCode: qrCode,
    };
  }

  async verifyQR(canEnter: boolean) {
    if (canEnter) {
      return {
        status: 'success',
        message: 'User can enter',
      };
    } else {
      return {
        status: 'error',
        message: 'User cannot enter',
      };
    }
  }
}
