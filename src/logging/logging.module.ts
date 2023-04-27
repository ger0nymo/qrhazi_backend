import { Module } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { LoggingController } from './logging.controller';
import { Log } from './log.entity';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { QrModule } from '../qr/qr.module';

@Module({
  imports: [
    UsersModule,
    AzureCosmosDbModule.forFeature([
      {
        collection: 'logs',
        dto: Log,
      },
    ]),
  ],
  providers: [LoggingService],
  controllers: [LoggingController],
})
export class LoggingModule {}
