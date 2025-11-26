import { Test, TestingModule } from '@nestjs/testing';
import { CharacterService } from './character.service';
import { Character, CharacterItem, Item } from '@game-domain';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

describe('CharacterService', () => {
  let service: CharacterService;
  let characterRepo: jest.Mocked<Repository<Character>>;
  let itemRepo: jest.Mocked<Repository<Item>>;
  let characterItemRepo: jest.Mocked<Repository<CharacterItem>>;

  const mockDataSource = {
    transaction: jest.fn(),
  } as unknown as DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharacterService,
        {
          provide: getRepositoryToken(Character),
          useValue: {
            createQueryBuilder: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Item),
          useValue: {
            createQueryBuilder: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(CharacterItem),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<CharacterService>(CharacterService);
    characterRepo = module.get(getRepositoryToken(Character));
    itemRepo = module.get(getRepositoryToken(Item));
    characterItemRepo = module.get(getRepositoryToken(CharacterItem));

    jest.clearAllMocks();
  });

  // findAllCharacters

  describe('findAllCharacters', () => {
    it('should return characters when found', async () => {
      const mockedQueryBuilder: any = {
        select: jest.fn().mockReturnThis(),
        getRawMany: jest
          .fn()
          .mockResolvedValue([
            { id: '1', name: 'Hero', health: 100, mana: 50 },
          ]),
      };

      characterRepo.createQueryBuilder.mockReturnValue(mockedQueryBuilder);

      const result = await service.findAllCharacters();

      expect(characterRepo.createQueryBuilder).toHaveBeenCalledWith(
        'character',
      );
      expect(mockedQueryBuilder.select).toHaveBeenCalled();
      expect(mockedQueryBuilder.getRawMany).toHaveBeenCalled();
      expect(result).toEqual([
        { id: '1', name: 'Hero', health: 100, mana: 50 },
      ]);
    });

    it('should throw NotFoundException when no characters found', async () => {
      const qb: any = {
        select: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      };

      characterRepo.createQueryBuilder.mockReturnValue(qb);

      await expect(service.findAllCharacters()).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // findeOneCharacter

  describe('findeOneCharacter', () => {
    const dto = {
      characterId: 'char-1',
      accountId: 'acc-1',
      isGameMaster: false,
    };

    it('should return read type when isRaw=false', async () => {
      const mockCharacter: any = {
        id: 'char-1',
        ownerId: 'acc-1',
        getReadType: jest.fn().mockReturnValue({
          id: 'char-1',
          name: 'Hero',
          health: 100,
          mana: 50,
        }),
      };

      characterRepo.findOne.mockResolvedValue(mockCharacter);

      const result = await service.findeOneCharacter(dto, false);

      expect(characterRepo.findOne).toHaveBeenCalledWith({
        where: { id: dto.characterId, ownerId: dto.accountId },
      });
      expect(mockCharacter.getReadType).toHaveBeenCalled();
      expect(result).toEqual({
        id: 'char-1',
        name: 'Hero',
        health: 100,
        mana: 50,
      });
    });

    it('should return raw character when isRaw=true', async () => {
      const mockCharacter: any = {
        id: 'char-1',
        ownerId: 'acc-1',
        name: 'Hero',
      };

      characterRepo.findOne.mockResolvedValue(mockCharacter);

      const result = await service.findeOneCharacter(dto, true);

      expect(result).toEqual(mockCharacter);
    });

    it('should not require ownerId when isGameMaster=true', async () => {
      const gmDto = { ...dto, isGameMaster: true };
      const mockCharacter: any = { id: 'char-1', ownerId: 'someone-else' };

      characterRepo.findOne.mockResolvedValue(mockCharacter);

      await service.findeOneCharacter(gmDto, true);

      expect(characterRepo.findOne).toHaveBeenCalledWith({
        where: { id: gmDto.characterId },
      });
    });

    it('should throw NotFoundException when character not found', async () => {
      characterRepo.findOne.mockResolvedValue(null);

      await expect(service.findeOneCharacter(dto, true)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // indAllItems

  describe('findAllItems', () => {
    it('should return items when found', async () => {
      const mockedQueryBuilder: any = {
        select: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          {
            id: 'item-1',
            name: 'Sword',
            description: 'Sharp',
            bonusStrength: 5,
            bonusAgility: 0,
            bonusIntelligence: 0,
            bonusFaith: 0,
          },
        ]),
      };

      itemRepo.createQueryBuilder.mockReturnValue(mockedQueryBuilder);

      const result = await service.findAllItems();

      expect(itemRepo.createQueryBuilder).toHaveBeenCalledWith('item');
      expect(mockedQueryBuilder.select).toHaveBeenCalled();
      expect(mockedQueryBuilder.getRawMany).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });

    it('should throw NotFoundException when no items found', async () => {
      const qb: any = {
        select: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      };

      itemRepo.createQueryBuilder.mockReturnValue(qb);

      await expect(service.findAllItems()).rejects.toThrow(NotFoundException);
    });
  });

  // findOneItem

  describe('findOneItem', () => {
    const dto = {
      itemId: 'item-1',
      accountId: 'acc-1',
    };

    it('should return item read type with suffix when highest bonus > 0', async () => {
      const mockItem: any = {
        id: 'item-1',
        name: 'Sword',
        description: 'Sharp',
        bonusStrength: 5,
        bonusAgility: 3,
        bonusIntelligence: 0,
        bonusFaith: 0,
        getReadType: jest.fn().mockReturnValue({
          id: 'item-1',
          name: 'Sword',
          description: 'Sharp',
          bonusStrength: 5,
          bonusAgility: 3,
          bonusIntelligence: 0,
          bonusFaith: 0,
        }),
      };

      itemRepo.findOne.mockResolvedValue(mockItem);

      const result = await service.findOneItem(dto);

      expect(itemRepo.findOne).toHaveBeenCalledWith({
        where: { id: dto.itemId },
      });
      expect(mockItem.getReadType).toHaveBeenCalled();
      expect(result.name).toBe('Sword of Strength');
    });

    it('should return name without suffix when all bonuses <= 0', async () => {
      const mockItem: any = {
        id: 'item-2',
        name: 'Rock',
        description: 'Just a rock',
        bonusStrength: 0,
        bonusAgility: 0,
        bonusIntelligence: 0,
        bonusFaith: 0,
        getReadType: jest.fn().mockReturnValue({
          id: 'item-2',
          name: 'Rock',
          description: 'Just a rock',
          bonusStrength: 0,
          bonusAgility: 0,
          bonusIntelligence: 0,
          bonusFaith: 0,
        }),
      };

      itemRepo.findOne.mockResolvedValue(mockItem);

      const result = await service.findOneItem(dto);

      expect(result.name).toBe('Rock');
    });

    it('should throw NotFoundException when item not found', async () => {
      itemRepo.findOne.mockResolvedValue(null);

      await expect(service.findOneItem(dto)).rejects.toThrow(NotFoundException);
    });
  });
});
