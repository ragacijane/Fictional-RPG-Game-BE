import { Module } from '@nestjs/common';
import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character, CharacterItem, Class, Item } from '@game-domain';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5433,
      username: 'character',
      password: 'character',
      database: 'character_db',
      autoLoadEntities: true,
      synchronize: false,
    }),
    // Repository
    TypeOrmModule.forFeature([Character, Item, Class, CharacterItem]),
  ],
  controllers: [CharacterController],
  providers: [CharacterService],
})
export class CharacterModule {}
