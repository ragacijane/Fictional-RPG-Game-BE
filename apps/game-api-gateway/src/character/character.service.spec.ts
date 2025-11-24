import { Test, TestingModule } from '@nestjs/testing';
import { CharacterAPIService } from './character.service';

describe('CharacterAPIService', () => {
  let service: CharacterAPIService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CharacterAPIService],
    }).compile();

    service = module.get<CharacterAPIService>(CharacterAPIService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
