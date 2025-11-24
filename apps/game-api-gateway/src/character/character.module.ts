import { Module } from '@nestjs/common';
import { CharacterAPIService } from './character.service';
import { CharacterAPIController } from './character.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from '../auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { CHARACTER_CLIENT } from '@game-domain';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    ClientsModule.registerAsync([
      {
        name: CHARACTER_CLIENT,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('CHARACTER_HOST'),
            port: config.get<number>('CHARACTER_PORT'),
          },
        }),
      },
    ]),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        store: await redisStore({
          host: config.get<string>('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT'),
          ttl: 60000,
        }),
      }),
    }),
  ],
  providers: [CharacterAPIService],
  controllers: [CharacterAPIController],
  exports: [CharacterAPIService],
})
export class CharacterAPIModule {}
