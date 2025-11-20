import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Character, Class, Item, CharacterItem } from '@game-domain';

const CombatDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: 5434,
  username: 'combat',
  password: 'combat',
  database: 'combat_db',
  entities: [Character, Class, Item, CharacterItem],
  migrations: ['libs/game-domain/src/migrations/*{.ts,.js}'],
  synchronize: false,
});

export default CombatDataSource;
