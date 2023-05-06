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

  @UseGuards(AuthGuard)
  @Patch('update-can-enter')
  async updateUserCanEnter(@Request() req) {
    const id = req.body.id;
    const canEnter = req.body.canEnter;
    const sender = req.user.username;

    const result = await this.usersService.updateCanEnter(id, canEnter, sender);
    if (!result) {
      return {
        message: `Bad request. User with id ${id} not found.`,
      };
    }
    return result;
  }

  @UseGuards(AuthGuard)
  @Get('get-all')
  async getAllUsers(@Request() req) {
    const result = await this.usersService.getAll(req.user.username);

    if (!result) {
      return {
        message: `Bad request. Sender user not found or is not admin.`,
      };
    }
    return result;
  }

  @UseGuards(AuthGuard)
  @Patch('update-is-in')
  async updateUserIsIn(@Request() req) {
    const username = req.user.username;

    const newIsIn : boolean = req.query.entryDirection === 'true' ? true : false;

    const result = await this.usersService.updateIsIn(username, newIsIn);
    if (!result) {
      return {
        message: `Bad request. User with username ${username} not found.`,
      };
    }
    return result;
  }
}
