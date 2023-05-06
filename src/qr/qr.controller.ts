import {
  Controller,
  UseGuards,
  Get,
  Request,
  HttpStatus,
  HttpCode,
  HttpException,
} from '@nestjs/common';
import { QrService } from './qr.service';
import { AuthGuard } from './../auth/auth.guard';
import { QRGuard } from './qr.guard';

@Controller('qr')
export class QrController {
  constructor(private qrService: QrService) {}

  @UseGuards(AuthGuard)
  @Get('generate')
  async generateQR(@Request() req) {
    if (req.query.direction === undefined) {
      throw new HttpException(
        'Direction not specified.',
        HttpStatus.BAD_REQUEST
      );
    }

    if (req.user.isIn === true && req.query.direction === 'true') {
      throw new HttpException(
        'You have to exit first.',
        HttpStatus.BAD_REQUEST
      );
    }

    if (req.user.isIn === false && req.query.direction === 'false') {
      throw new HttpException(
        'You have to enter first.',
        HttpStatus.BAD_REQUEST
      );
    }

    const result = await this.qrService.generateQR(
      req.user.username,
      req.query.direction
    );

    return result;
  }

  @UseGuards(QRGuard)
  @Get('verify')
  async verifyQR(@Request() req) {
    if (req.invalidQrCode) {
      throw new HttpException('Invalid QR code.', HttpStatus.BAD_REQUEST);
    }
    return await this.qrService.verifyQR(req.user.canEnter);
  }
}
