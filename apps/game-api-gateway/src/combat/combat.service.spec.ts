import { Test, TestingModule } from '@nestjs/testing';
import { CombatAPIService } from './combat.service';

describe('CombatAPIService', () => {
  let service: CombatAPIService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CombatAPIService],
    }).compile();

    service = module.get<CombatAPIService>(CombatAPIService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
