import { Test, TestingModule } from '@nestjs/testing';
import { AccountAPIController } from './account.controller';

describe('AccountAPIController', () => {
  let controller: AccountAPIController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountAPIController],
    }).compile();

    controller = module.get<AccountAPIController>(AccountAPIController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
