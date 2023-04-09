import { Controller, Get, Post, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/azure-database';
import { Container } from '@azure/cosmos';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User) private readonly userContainer: Container) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const query: string = `SELECT * FROM c WHERE c.id = "${id.toString()}"`;

    const cosmosResults = await this.userContainer.items
      .query<User>(query)
      .fetchAll();

    if (cosmosResults.resources.length === 0) {
      return {
        message: `User with id ${id} not found`,
      };
    }

    return cosmosResults.resources[0];
  }
}
