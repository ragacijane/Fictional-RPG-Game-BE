import 'reflect-metadata';
import { seedGameDomain } from '@game-domain';
import CharacterDataSource from '../typeorm.config';

seedGameDomain(CharacterDataSource).catch((err) => {
  console.error(err);
  process.exit(1);
});
