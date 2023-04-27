import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QrModule } from './qr/qr.module';
import { LoggingModule } from './logging/logging.module';

@Module({
  imports: [
    AzureCosmosDbModule.forRoot({
      dbName: process.env.AZURE_COSMOS_DB_NAME,
      endpoint: process.env.AZURE_COSMOS_DB_ENDPOINT,
      key: process.env.AZURE_COSMOS_DB_KEY,
    }),
    AuthModule,
    UsersModule,
    QrModule,
    LoggingModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
