import { CosmosPartitionKey } from '@nestjs/azure-database';

@CosmosPartitionKey('id')
export class Log {
  id: string;
  username: string;
  date: string;
  in: boolean;
}
