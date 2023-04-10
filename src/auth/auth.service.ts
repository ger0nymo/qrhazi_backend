import {
  Injectable,
  UnauthorizedException,
  HttpStatus,
  HttpException,
  ExceptionFilter,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserDto } from './../users/user.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(username, pass): Promise<any> {
    const user = await this.usersService.findOneByName(username);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const passwordMatch = await bcrypt.compare(pass, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException();
    }

    const payload = { username: user.username, sub: user.userId };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(username, pass, email): Promise<any> {
    const newUser = <IUserDto>{
      id: uuidv4(),
      username: username,
      password: await bcrypt.hash(pass, 10),
      email: email,
      canEnter: false,
      isAdmin: false,
    };

    const user = await this.usersService.create(newUser);

    if (!user) {
      return null;
    }

    const payload = { username: user.username, sub: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
