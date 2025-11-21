import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Character, Class, Item, CharacterItem, Duel } from '@game-domain';

const CombatDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: 5434,
  username: 'combat',
  password: 'combat',
  database: 'combat_db',
  entities: [Character, Class, Item, CharacterItem, Duel],
  migrations: ['apps/combat/src/migrations/*{.ts,.js}'],
  synchronize: false,
});

export default CombatDataSource;
