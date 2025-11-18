import { Test, TestingModule } from '@nestjs/testing';
import { GameApiGatewayController } from './game-api-gateway.controller';
import { GameApiGatewayService } from './game-api-gateway.service';

describe('GameApiGatewayController', () => {
  let gameApiGatewayController: GameApiGatewayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GameApiGatewayController],
      providers: [GameApiGatewayService],
    }).compile();

    gameApiGatewayController = app.get<GameApiGatewayController>(GameApiGatewayController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(gameApiGatewayController.getHello()).toBe('Hello World!');
    });
  });
});
