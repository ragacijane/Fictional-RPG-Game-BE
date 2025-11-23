import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from '../auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';

@Module({
  imports: [
    AuthModule,
    // TODO: Put into env/const
    ClientsModule.register([
      {
        name: 'CHARACTER_CLIENT',
        transport: Transport.TCP,
        options: {
          // host: 'character',
          port: 3002,
        },
      },
    ]),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          host: 'localhost', //process.env.REDIS_HOST ?? 'localhost',
          port: 6379, //Number(process.env.REDIS_PORT ?? 6379),
          ttl: 60000, // default TTL
        }),
      }),
    }),
  ],
  providers: [CharacterService],
  controllers: [CharacterController],
  exports: [CharacterService],
})
export class CharacterModule {}
