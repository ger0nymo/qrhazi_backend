import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { User } from './user.entity';
@Module({
  imports: [
    AzureCosmosDbModule.forFeature([
      {
        collection: 'users',
        dto: User,
      },
    ]),
  ],

  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
