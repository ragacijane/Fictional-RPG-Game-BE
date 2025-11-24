import { Module } from '@nestjs/common';
import { CombatAPIService } from './combat.service';
import { CombatAPIController } from './combat.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CharacterAPIModule } from '../character/character.module';
import { COMBAT_CLIENT } from '@game-domain';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClientsModule.registerAsync([
      {
        name: COMBAT_CLIENT,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('COMBAT_HOST'),
            port: config.get<number>('COMBAT_PORT'),
          },
        }),
      },
    ]),
    CharacterAPIModule,
  ],
  providers: [CombatAPIService],
  controllers: [CombatAPIController],
})
export class CombatAPIModule {}
