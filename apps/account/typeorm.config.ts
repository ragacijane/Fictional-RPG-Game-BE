import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Account } from './src/entities/account.entity';

// TODO: Put in ENV

const AccountDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  username: 'account',
  password: 'account',
  database: 'account_db',
  entities: [Account],
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
  synchronize: false,
});

export default AccountDataSource;
