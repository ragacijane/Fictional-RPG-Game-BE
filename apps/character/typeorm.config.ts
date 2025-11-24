import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Character, Class, Item, CharacterItem } from '@game-domain';

const CharacterDataSource = new DataSource({
  type: 'postgres',
  host: process.env.CHARACTER_DB_HOST!,
  port: Number(process.env.CHARACTER_DB_PORT!),
  username: process.env.CHARACTER_DB_USER!,
  password: process.env.CHARACTER_DB_PASS!,
  database: process.env.CHARACTER_DB_NAME!,
  entities: [Character, Class, Item, CharacterItem],
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
  synchronize: false,
});

export default CharacterDataSource;
