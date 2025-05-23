import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './entities/User';
import { Group } from './entities/Group';
import { Role } from './entities/Role';
import { GroupMember } from './entities/GroupMember';
import { Notification } from './entities/Notification';
import { JoinRequest } from './entities/JoinRequest';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'group_management',
  synchronize: true,
  logging: true,
  entities: [User, Group, Role, GroupMember, Notification, JoinRequest],
  migrations: [],
  subscribers: [],
}); 