import { Module } from '@nestjs/common';
import { GameApiGatewayController } from './game-api-gateway.controller';
import { GameApiGatewayService } from './game-api-gateway.service';
import { AccountModule } from './account/account.module';

@Module({
  imports: [AccountModule],
  controllers: [GameApiGatewayController],
  providers: [GameApiGatewayService],
})
export class GameApiGatewayModule {}
