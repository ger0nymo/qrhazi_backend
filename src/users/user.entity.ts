import { CosmosPartitionKey } from '@nestjs/azure-database';

@CosmosPartitionKey('id')
export class User {
  id: string;
  username: string;
  password: string;
  email: string;
  canEnter: boolean;
  isAdmin: boolean;
}
