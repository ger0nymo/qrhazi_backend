import {
  Controller,
  Get,
  Post,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/azure-database';
import { Container } from '@azure/cosmos';
import { User } from './user.entity';
import { AuthGuard } from './../auth/auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    @InjectModel(User) private readonly userContainer: Container,
    private usersService: UsersService
  ) {}

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

  @UseGuards(AuthGuard)
  @Patch('update-can-enter')
  async updateUserCanEnter(@Request() req) {
    const id = req.body.id;
    const canEnter = req.body.canEnter;
    const sender = req.body.sender;
    const result = await this.usersService.updateCanEnter(id, canEnter, sender);
    if (!result) {
      return {
        message: `Bad request. Sender user or user with id ${id} not found`,
      };
    }
    return result;
  }
}
