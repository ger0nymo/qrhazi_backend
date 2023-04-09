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
    return await this.qrService.generateQR(req.user.username);
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
