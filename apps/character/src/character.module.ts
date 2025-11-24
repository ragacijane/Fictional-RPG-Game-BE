import { Module } from '@nestjs/common';
import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character, CharacterItem, Class, Item } from '@game-domain';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.CHARACTER_DB_HOST,
      port: Number(process.env.CHARACTER_DB_PORT),
      username: process.env.CHARACTER_DB_USER,
      password: process.env.CHARACTER_DB_PASS,
      database: process.env.CHARACTER_DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Character, Item, Class, CharacterItem]), // Repository
  ],
  controllers: [CharacterController],
  providers: [CharacterService],
})
export class CharacterModule {}
