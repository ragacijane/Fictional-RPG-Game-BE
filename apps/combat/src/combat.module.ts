import { Module } from '@nestjs/common';
import { CombatController } from './combat.controller';
import { CombatService } from './combat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Character,
  CHARACTER_CLIENT,
  CharacterItem,
  Class,
  Duel,
  Item,
  RpcErrorInterceptor,
} from '@game-domain';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DuelDomainService } from './domain/duel-domain.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.COMBAT_DB_HOST,
      port: Number(process.env.COMBAT_DB_PORT),
      username: process.env.COMBAT_DB_USER,
      password: process.env.COMBAT_DB_PASS,
      database: process.env.COMBAT_DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Character, Item, Class, CharacterItem, Duel]), // Repositories
    ClientsModule.register([
      {
        name: CHARACTER_CLIENT,
        transport: Transport.TCP,
        options: {
          host: process.env.CHARACTER_HOST,
          port: Number(process.env.CHARACTER_PORT),
        },
      },
    ]),
  ],
  controllers: [CombatController],
  providers: [
    DuelDomainService,
    CombatService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RpcErrorInterceptor,
    },
  ],
})
export class CombatModule {}
