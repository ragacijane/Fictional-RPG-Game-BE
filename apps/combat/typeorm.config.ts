import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Character, Class, Item, CharacterItem, Duel } from '@game-domain';

const CombatDataSource = new DataSource({
  type: 'postgres',
  host: process.env.COMBAT_DB_HOST!,
  port: Number(process.env.COMBAT_DB_PORT!),
  username: process.env.COMBAT_DB_USER!,
  password: process.env.COMBAT_DB_PASS!,
  database: process.env.COMBAT_DB_NAME!,
  entities: [Character, Class, Item, CharacterItem, Duel],
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
  synchronize: false,
});

export default CombatDataSource;
