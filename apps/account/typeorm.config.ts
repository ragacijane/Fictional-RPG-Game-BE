import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Account } from '@game-domain';

const AccountDataSource = new DataSource({
  type: 'postgres',
  host: process.env.ACCOUNT_DB_HOST!,
  port: Number(process.env.ACCOUNT_DB_PORT!),
  username: process.env.ACCOUNT_DB_USER!,
  password: process.env.ACCOUNT_DB_PASS!,
  database: process.env.ACCOUNT_DB_NAME!,
  entities: [Account],
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
  synchronize: false,
});

export default AccountDataSource;
