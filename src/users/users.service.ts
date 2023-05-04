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

  async getAll(sender: string): Promise<User[] | any> {
    const senderUser = await this.findOneByName(sender);
    console.log(senderUser);

    if (!senderUser) {
      return null;
    }
    if (!senderUser.isAdmin) {
      return null;
    }

    const { resources } = await this.userContainer.items
      .query<User>('SELECT * FROM c')
      .fetchAll();
    return resources;
  }

  async updateIsIn(username: string, entryDirection: boolean) {
    const query = `SELECT * FROM c WHERE c.username = '${username}'`;
    const { resources } = await this.userContainer.items
      .query<User>(query)
      .fetchAll();
    if (resources.length === 0) {
      return null;
    }
    const user = resources[0];
    const query = `UPDATE c SET c.isIn = ${entryDirection} WHERE c.id = '${user.id}'`;
    const result = await this.userContainer.items.query<User>(query).fetchAll();
    return result;
  }

  async updateCanEnter(
    id: string,
    toValue: boolean,
    sender: string
  ): Promise<User | any> {
    const senderUser = await this.findOneByName(sender);
    if (!senderUser) {
      return null;
    }
    if (!senderUser.isAdmin) {
      return null;
    }
    const query = `SELECT * FROM c WHERE c.id = '${id}'`;
    const { resources } = await this.userContainer.items
      .query<User>(query)
      .fetchAll();
    if (resources.length === 0) {
      return null;
    }
    const user = resources[0];
    user.canEnter = toValue;
    const { resource } = await this.userContainer.items.upsert(user);
    return resource;
  }
}
