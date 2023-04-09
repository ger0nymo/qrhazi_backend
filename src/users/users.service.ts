import { Injectable } from '@nestjs/common';
import { Container } from '@azure/cosmos';
import { InjectModel } from '@nestjs/azure-database';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userContainer: Container) {}

  async findOneByName(username: string): Promise<User | any> {
    const query = `SELECT * FROM c WHERE c.username = '${username}'`;
    const { resources } = await this.userContainer.items
      .query<User>(query)
      .fetchAll();

    return resources[0] || null;
  }

  async create(user: User): Promise<User | any> {
    const query = `SELECT * FROM c WHERE c.username = '${user.username}'`;
    const { resources } = await this.userContainer.items
      .query<User>(query)
      .fetchAll();
    if (resources.length > 0) {
      return null;
    }
    const { resource } = await this.userContainer.items.create(user);
    return resource;
  }
}