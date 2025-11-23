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
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateItemDto,
  FindOneItemDto,
  GiftItemsDto,
  GrantItemsDto,
  ItemReadType,
} from 'libs/game-domain/src/dtos/item.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(CharacterItem)
    private readonly characterItemRepository: Repository<CharacterItem>,
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

    if (!characters || characters.length === 0) {
      throw new RpcException(new NotFoundException(`Characters not found.`));
    }

    console.log('Successfully retrieved all characters.');
    return characters;
  }

  async findeOneCharacter(
    dto: FindOneCharacterDto,
  ): Promise<CharacterReadType> {
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
      throw new RpcException(
        new NotFoundException(
          `Character with id ${dto.characterId} not found.`,
        ),
      );
    }
    console.log(`Successfully retrieved character ${dto.characterId}`);
    return character.getReadType();
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
    if (!items) {
      throw new RpcException(new NotFoundException('Items not found'));
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
      throw new RpcException(
        new NotFoundException(`Item with id ${dto.itemId} not found.`),
      );
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
    const character = this.characterRepository.findOne({
      where: { id: dto.characterId, ownerId: dto.accountId },
    });
    if (!character) {
      throw new RpcException(
        new NotFoundException(
          `Character with id ${dto.characterId} not found.`,
        ),
      );
    }
    const item = this.itemRepository.findOne({
      where: { id: dto.itemId },
    });

    if (!item) {
      throw new RpcException(
        new NotFoundException(`Item with id ${dto.itemId} not found.`),
      );
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

    const senderCharacter = this.characterRepository.findOne({
      where: { id: dto.senderCharacterId, ownerId: dto.accountId },
    });
    if (!senderCharacter) {
      throw new RpcException(
        new NotFoundException(
          `Sender Character with id ${dto.senderCharacterId} not found.`,
        ),
      );
    }

    const recieverCharacter = this.characterRepository.findOne({
      where: { id: dto.recieverCharacterId },
    });
    if (!recieverCharacter) {
      throw new RpcException(
        new NotFoundException(
          `Reciever Character with id ${dto.recieverCharacterId} not found.`,
        ),
      );
    }

    const item = this.itemRepository.findOne({
      where: { id: dto.itemId },
    });

    if (!item) {
      throw new RpcException(
        new NotFoundException(`Item with id ${dto.itemId} not found.`),
      );
    }

    // Sender logic
    let senderCharItem = await this.characterItemRepository.findOne({
      where: {
        character: { id: dto.senderCharacterId },
        item: { id: dto.itemId },
      },
      relations: ['character', 'item'],
    });

    if (!senderCharItem) {
      throw new RpcException(
        new NotFoundException('Item doesnt exists for sender character.'),
      );
    }
    senderCharItem.decQuantity();

    if (senderCharItem.quantity == 0) {
      await this.characterItemRepository.delete({ id: senderCharItem.id });
    } else {
      await this.characterItemRepository.save(senderCharItem);
    }

    // Reciever logic
    let recievedCharItem = await this.characterItemRepository.findOne({
      where: {
        character: { id: dto.recieverCharacterId },
        item: { id: dto.itemId },
      },
      relations: ['character', 'item'],
    });

    if (recievedCharItem) {
      recievedCharItem.incQuantity();
    } else {
      recievedCharItem = this.characterItemRepository.create({
        characterId: dto.recieverCharacterId,
        itemId: dto.itemId,
        quantity: 1,
      });
    }

    await this.characterItemRepository.save(recievedCharItem);
    console.log(
      `Character ${dto.senderCharacterId} gifting item ${dto.itemId} to character ${dto.recieverCharacterId} SUCCESSFULLY`,
    );
    return;
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
