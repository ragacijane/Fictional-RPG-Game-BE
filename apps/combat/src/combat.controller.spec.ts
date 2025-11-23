import { Test, TestingModule } from '@nestjs/testing';
import { CombatController } from './combat.controller';
import { CombatService } from './combat.service';

describe('CombatController', () => {
  let combatController: CombatController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CombatController],
      providers: [CombatService],
    }).compile();

    combatController = app.get<CombatController>(CombatController);
  });

  // describe('root', () => {
  //   it('should return "Hello World!"', () => {
  //     expect(combatController.getHello()).toBe('Hello World!');
  //   });
  // });
});
