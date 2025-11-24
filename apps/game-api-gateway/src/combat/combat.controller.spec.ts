import { Test, TestingModule } from '@nestjs/testing';
import { CombatAPIController } from './combat.controller';

describe('CombatAPIController', () => {
  let controller: CombatAPIController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CombatAPIController],
    }).compile();

    controller = module.get<CombatAPIController>(CombatAPIController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
