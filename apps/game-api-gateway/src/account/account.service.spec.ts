import { Test, TestingModule } from '@nestjs/testing';
import { AccountAPIService } from './account.service';

describe('AccountAPIService', () => {
  let service: AccountAPIService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountAPIService],
    }).compile();

    service = module.get<AccountAPIService>(AccountAPIService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
