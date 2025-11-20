import { Module } from '@nestjs/common';
import { CombatController } from './combat.controller';
import { CombatService } from './combat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character, CharacterItem, Class, Item } from '@game-domain';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5434,
      username: 'combat',
      password: 'combat',
      database: 'combat_db',
      autoLoadEntities: true,
      synchronize: false,
    }),
    // Repository
    TypeOrmModule.forFeature([Character, Item, Class, CharacterItem]),
  ],
  controllers: [CombatController],
  providers: [CombatService],
})
export class CombatModule {}
