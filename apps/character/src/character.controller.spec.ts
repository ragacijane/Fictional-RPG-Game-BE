import { Test, TestingModule } from '@nestjs/testing';
import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';

describe('CharacterController', () => {
  let controller: CharacterController;
  let service: CharacterService;

  const mockCharacterService = {
    findeOneCharacter: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharacterController],
      providers: [
        {
          provide: CharacterService,
          useValue: mockCharacterService,
        },
      ],
    }).compile();

    controller = module.get<CharacterController>(CharacterController);
    service = module.get<CharacterService>(CharacterService);

    jest.clearAllMocks();
  });

  describe('findOneCharacter', () => {
    it('should return character when service returns data', async () => {
      const mockCharacter = { id: '123', ownerId: 'acc1', name: 'Luka' };

      mockCharacterService.findeOneCharacter.mockResolvedValue(mockCharacter);

      const dto = {
        characterId: '123',
        accountId: 'acc1',
        isGameMaster: false,
      };

      const result = await controller.findOneCharacter(dto);

      expect(service.findeOneCharacter).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockCharacter);
    });

    it('should propagate errors thrown by the service', async () => {
      mockCharacterService.findeOneCharacter.mockRejectedValue(
        new Error('Character not found'),
      );

      const dto = {
        characterId: '999',
        accountId: 'acc1',
        isGameMaster: false,
      };

      await expect(controller.findOneCharacter(dto)).rejects.toThrow(
        'Character not found',
      );
    });
  });
});
