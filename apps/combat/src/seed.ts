import { seedGameDomain } from '@game-domain';
import 'reflect-metadata';
import CombatDataSource from '../typeorm.config';

seedGameDomain(CombatDataSource).catch((err) => {
  console.error(err);
  process.exit(1);
});
