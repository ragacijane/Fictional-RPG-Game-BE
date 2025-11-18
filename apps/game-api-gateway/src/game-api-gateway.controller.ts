import { Controller, Get } from '@nestjs/common';
import { GameApiGatewayService } from './game-api-gateway.service';

@Controller()
export class GameApiGatewayController {
  constructor(private readonly gameApiGatewayService: GameApiGatewayService) {}

  @Get()
  getHello(): string {
    return this.gameApiGatewayService.getHello();
  }
}
