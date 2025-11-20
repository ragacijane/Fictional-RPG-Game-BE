import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Character, Class, Item, CharacterItem } from '@game-domain';

const CharacterDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: 5433,
  username: 'character',
  password: 'character',
  database: 'character_db',
  entities: [Character, Class, Item, CharacterItem],
  migrations: ['libs/game-domain/src/migrations/*{.ts,.js}'],
  synchronize: false,
});

export default CharacterDataSource;
