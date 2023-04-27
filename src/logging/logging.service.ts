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
    log.date = new Date().toISOString();
    const { resource } = await this.logContainer.items.create(log);
    return resource;
  }
}
