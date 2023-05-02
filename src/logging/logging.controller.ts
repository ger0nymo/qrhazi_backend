import {
  Controller,
  UseGuards,
  Post,
  Get,
  Request,
  HttpStatus,
  HttpCode,
  HttpException,
} from '@nestjs/common';
import { LoggingService } from './logging.service';
import { QRGuard } from '../qr/qr.guard';
import { AuthGuard } from '../auth/auth.guard';

@Controller('logging')
export class LoggingController {
  constructor(private loggingService: LoggingService) {}

  @UseGuards(QRGuard)
  @Post('create')
  async createLog(@Request() req) {
    const result = await this.loggingService.createLog(req.user.username);
    if (!result) {
      throw new HttpException('Log creation failed.', HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @UseGuards(AuthGuard)
  @Get('all')
  async getAllLogs(@Request() req) {
    const user = req.user;
    if (user?.isAdmin !== true) {
      throw new HttpException('User is not admin.', HttpStatus.UNAUTHORIZED);
    }
    const result = await this.loggingService.getAllLogs();
    if (!result) {
      throw new HttpException('Log retrieval failed.', HttpStatus.BAD_REQUEST);
    }
    return result;
  }
}
