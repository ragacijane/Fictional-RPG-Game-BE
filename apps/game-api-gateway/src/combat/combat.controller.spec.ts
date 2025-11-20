import { Test, TestingModule } from '@nestjs/testing';
import { CombatController } from './combat.controller';

describe('CombatController', () => {
  let controller: CombatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CombatController],
    }).compile();

    controller = module.get<CombatController>(CombatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
