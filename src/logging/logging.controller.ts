import {
  Controller,
  UseGuards,
  Post,
  Request,
  HttpStatus,
  HttpCode,
  HttpException,
} from '@nestjs/common';
import { LoggingService } from './logging.service';
import { QRGuard } from '../qr/qr.guard';

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
}
