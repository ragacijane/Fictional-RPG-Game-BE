import { Module } from '@nestjs/common';
import { GameApiGatewayController } from './game-api-gateway.controller';
import { GameApiGatewayService } from './game-api-gateway.service';
import { AccountAPIModule } from './account/account.module';
import { CharacterAPIModule } from './character/character.module';
import { CombatAPIModule } from './combat/combat.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AccountAPIModule,
    CharacterAPIModule,
    CombatAPIModule,
    AuthModule,
  ],
  controllers: [GameApiGatewayController],
  providers: [GameApiGatewayService],
})
export class GameApiGatewayModule {}
