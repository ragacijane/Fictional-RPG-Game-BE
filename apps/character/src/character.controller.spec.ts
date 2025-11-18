import { Test, TestingModule } from '@nestjs/testing';
import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';

describe('CharacterController', () => {
  let characterController: CharacterController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CharacterController],
      providers: [CharacterService],
    }).compile();

    characterController = app.get<CharacterController>(CharacterController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(characterController.getHello()).toBe('Hello World!');
    });
  });
});
