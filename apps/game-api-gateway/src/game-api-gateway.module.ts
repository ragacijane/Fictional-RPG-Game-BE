import { Module } from '@nestjs/common';
import { GameApiGatewayController } from './game-api-gateway.controller';
import { GameApiGatewayService } from './game-api-gateway.service';
import { AccountModule } from './account/account.module';
import { CharacterModule } from './character/character.module';
import { CombatModule } from './combat/combat.module';

@Module({
  imports: [AccountModule, CharacterModule, CombatModule],
  controllers: [GameApiGatewayController],
  providers: [GameApiGatewayService],
})
export class GameApiGatewayModule {}
