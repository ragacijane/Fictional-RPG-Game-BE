import { Test, TestingModule } from '@nestjs/testing';
import { CharacterAPIController } from './character.controller';

describe('CharacterAPIController', () => {
  let controller: CharacterAPIController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharacterAPIController],
    }).compile();

    controller = module.get<CharacterAPIController>(CharacterAPIController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
