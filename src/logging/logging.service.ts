import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/azure-database';
import { Container } from '@azure/cosmos';
import { Log } from './log.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingService {
  constructor(@InjectModel(Log) private readonly logContainer: Container) {}

  async createLog(username: string) {
    const log = new Log();
    log.id = uuidv4();
    log.username = username;

    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    log.date = dateTimeString;

    const { resource } = await this.logContainer.items.create(log);
    return resource;
  }

  async getAllLogs() {
    try {
      const { resources } = await this.logContainer.items.readAll().fetchAll();
      return resources;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
