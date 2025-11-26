import {
  Character,
  CharacterItem,
  CharacterReadType,
  CreateCharacterDto,
  AllCharactersListDto,
  FindOneCharacterDto,
  Item,
} from '@game-domain';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateItemDto,
  FindOneItemDto,
  GiftItemsDto,
  GrantItemsDto,
  ItemReadType,
} from 'libs/game-domain/src/dtos/item.dto';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(CharacterItem)
    private readonly characterItemRepository: Repository<CharacterItem>,
    private readonly dataSource: DataSource,
  ) {}

  async findAllCharacters(): Promise<AllCharactersListDto[]> {
    console.log('Retrieving all characters');
    const characters = await this.characterRepository
      .createQueryBuilder('character')
      .select([
        'character.id AS id',
        'character.name AS name',
        'character.health AS health',
        'character.mana AS mana',
      ])
      .getRawMany();

    if (!characters.length) {
      throw new NotFoundException(`Characters not found.`);
    }

    console.log('Successfully retrieved all characters.');
    return characters;
  }

  async findeOneCharacter(
    dto: FindOneCharacterDto,
    isRaw: boolean,
  ): Promise<CharacterReadType | Character> {
    console.log(
      `Looking for character ${dto.characterId} for account ${dto.accountId}`,
    );

    const where: Record<string, any> = {
      id: dto.characterId,
    };

    if (!dto.isGameMaster) {
      where.ownerId = dto.accountId;
    }
    const character = await this.characterRepository.findOne({
      where,
    });
    if (!character) {
      throw new NotFoundException(
        `Character with id ${dto.characterId} not found.`,
      );
    }
    console.log(`Successfully retrieved character ${dto.characterId}`);
    return isRaw ? character : character.getReadType();
  }

  async createCharacter(dto: CreateCharacterDto) {
    console.log('Creating character with parameters:', dto);
    const newCharacter = this.characterRepository.create(dto);
    await this.characterRepository.save(newCharacter);
    console.log('Successfully created character.');
    return newCharacter.id;
  }

  async findAllItems(): Promise<ItemReadType[]> {
    console.log('Retrieving all items');
    const items = await this.itemRepository
      .createQueryBuilder('item')
      .select([
        'item.id AS id',
        'item.name AS name',
        'item.description AS description',
        'item.bonusStrength AS bonusStrength',
        'item.bonusAgility AS bonusAgility',
        'item.bonusIntelligence AS bonusIntelligence',
        'item.bonusFaith AS bonusFaith',
      ])
      .getRawMany();
    if (!items.length) {
      throw new NotFoundException('Items not found');
    }
    console.log('Successfully retrieved all items.');
    return items;
  }

  async findOneItem(dto: FindOneItemDto): Promise<ItemReadType> {
    console.log(`Looking for item ${dto.itemId} for account ${dto.accountId}`);
    const item = await this.itemRepository.findOne({
      where: { id: dto.itemId },
    });
    if (!item) {
      throw new NotFoundException(`Item with id ${dto.itemId} not found.`);
    }
    console.log(`Successfully retrieved item ${dto.itemId}`);
    const suffix = this.determineItemSuffix(item);
    return {
      ...item.getReadType(),
      name: suffix ? `${item.name} ${suffix}` : item.name,
    };
  }

  async createItem(dto: CreateItemDto) {
    console.log('Creating item with parameters:', dto);
    const newItem = this.itemRepository.create(dto);
    await this.itemRepository.save(newItem);
    console.log('Successfully created item.');
    return newItem.id;
  }

  async grantItem(dto: GrantItemsDto) {
    console.log(`Character ${dto.characterId} granting item ${dto.itemId}`);
    const character = await this.characterRepository.findOne({
      where: { id: dto.characterId, ownerId: dto.accountId },
    });
    if (!character) {
      throw new NotFoundException(
        `Character with id ${dto.characterId} not found.`,
      );
    }
    const item = await this.itemRepository.findOne({
      where: { id: dto.itemId },
    });

    if (!item) {
      throw new NotFoundException(`Item with id ${dto.itemId} not found.`);
    }

    let charItem = await this.characterItemRepository.findOne({
      where: {
        character: { id: dto.characterId },
        item: { id: dto.itemId },
      },
      relations: ['character', 'item'],
    });

    if (charItem) {
      charItem.incQuantity();
    } else {
      charItem = this.characterItemRepository.create({
        characterId: dto.characterId,
        itemId: dto.itemId,
        quantity: 1,
      });
    }

    await this.characterItemRepository.save(charItem);
    console.log(
      `Character ${dto.characterId} granted item ${dto.itemId} SUCCESSFULLY!`,
    );
    return true;
  }

  async giftItem(dto: GiftItemsDto) {
    console.log(
      `Character ${dto.senderCharacterId} gifting item ${dto.itemId} to character ${dto.recieverCharacterId}`,
    );

    const senderCharacter = await this.characterRepository.findOne({
      where: { id: dto.senderCharacterId, ownerId: dto.accountId },
    });
    if (!senderCharacter) {
      throw new NotFoundException(
        `Sender Character with id ${dto.senderCharacterId} not found.`,
      );
    }

    const recieverCharacter = await this.characterRepository.findOne({
      where: { id: dto.recieverCharacterId },
    });
    if (!recieverCharacter) {
      throw new NotFoundException(
        `Reciever Character with id ${dto.recieverCharacterId} not found.`,
      );
    }

    const item = await this.itemRepository.findOne({
      where: { id: dto.itemId },
    });

    if (!item) {
      throw new NotFoundException(`Item with id ${dto.itemId} not found.`);
    }

    return this.dataSource.transaction(async (manager) => {
      const charItemRepo = manager.getRepository(CharacterItem);

      const senderCharItem = await charItemRepo.findOne({
        where: {
          characterId: dto.senderCharacterId,
          itemId: dto.itemId,
        },
      });

      if (!senderCharItem) {
        throw new NotFoundException('Item doesnt exists for sender character');
      }
      let recieverCharItem = await charItemRepo.findOne({
        where: {
          characterId: dto.recieverCharacterId,
          itemId: dto.itemId,
        },
      });

      if (senderCharItem.quantity == 1) {
        if (recieverCharItem) {
          console.log('Char Items: sender qty = 1, reciever exists');
          recieverCharItem.quantity += 1;
          await charItemRepo.save(recieverCharItem);
          await charItemRepo.delete({
            id: senderCharItem.id,
          });
        } else {
          console.log('Char Items: sender qty = 1, reciever not exist');
          senderCharItem.characterId = dto.recieverCharacterId;
          await charItemRepo.save(senderCharItem);
        }
      } else {
        senderCharItem.quantity -= 1;
        await charItemRepo.save(senderCharItem);

        if (!recieverCharItem) {
          console.log('Char Items: sender qty > 1, reciever not exist');
          recieverCharItem = charItemRepo.create({
            characterId: dto.recieverCharacterId,
            itemId: dto.itemId,
            quantity: 1,
          });
        } else {
          console.log('Char Items: sender qty > 1, reciever exists');

          recieverCharItem.quantity += 1;
        }
        await charItemRepo.save(recieverCharItem);
      }

      return true;
    });
  }

  private determineItemSuffix(item: Item): string {
    const bonuses = [
      { stat: 'Strength', value: item.bonusStrength },
      { stat: 'Agility', value: item.bonusAgility },
      { stat: 'Intelligence', value: item.bonusIntelligence },
      { stat: 'Faith', value: item.bonusFaith },
    ];

    const highest = bonuses.reduce((prev, curr) =>
      curr.value > prev.value ? curr : prev,
    );

    if (highest.value <= 0) {
      return '';
    }

    return `of ${highest.stat}`;
  }
}
