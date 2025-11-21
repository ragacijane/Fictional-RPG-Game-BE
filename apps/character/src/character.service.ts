import {
  Character,
  CharacterItem,
  CreateCharacterDto,
  FindOneCharacterDto,
  Item,
} from '@game-domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateItemDto,
  FindOneItemDto,
  GiftItemsDto,
  GrantItemsDto,
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

  async findAllCharacters() {
    console.log('Retrieving all characters');
    const characters = await this.characterRepository.find();

    if (!characters) {
      return 'Characters not found.';
    }

    console.log('Successfully retrieved all characters.');
    return characters;
  }

  async findeOneCharacter(dto: FindOneCharacterDto) {
    console.log(
      `Looking for character ${dto.characterId} for account ${dto.accountId}`,
    );
    const where: Record<string, any>[] = [];
    where.push({ id: dto.characterId });
    if (!dto.isGameMaster) {
      where.push({ ownerId: dto.accountId });
    }
    const character = await this.characterRepository.findOne({
      where,
    });
    if (!character) {
      return 'Character not found.';
    }
    console.log(`Successfully retrievec character ${dto.characterId}`);
    return character;
  }

  async createCharacter(dto: CreateCharacterDto) {
    console.log('Creating character with parameters:', dto);
    const newCharacter = this.characterRepository.create(dto);
    await this.characterRepository.save(newCharacter);
    console.log('Successfully created character.');
    return newCharacter.id;
  }

  async findAllItems() {
    console.log('Retrieving all items');
    const items = await this.itemRepository.find();
    if (!items) {
      return 'Items not found';
    }
    console.log('Successfully retrieved all items.');
    return items;
  }

  async findOneItem(dto: FindOneItemDto) {
    console.log(`Looking for item ${dto.itemId} for account ${dto.accountId}`);
    const item = await this.itemRepository.findOne({
      where: { id: dto.itemId },
    });
    if (!item) {
      return 'Item not found.';
    }
    console.log(`Successfully retrieved item ${dto.itemId}`);

    return item;
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
      where: { id: dto.characterId },
    });
    if (!character) {
      return 'Character not found.';
    }
    const item = this.itemRepository.findOne({
      where: { id: dto.itemId },
    });

    if (!item) {
      return 'Item not found.';
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
      where: { id: dto.senderCharacterId },
    });
    if (!senderCharacter) {
      return 'Sender character not found.';
    }

    const recieverCharacter = this.characterRepository.findOne({
      where: { id: dto.recieverCharacterId },
    });
    if (!recieverCharacter) {
      return 'Reciever character not found.';
    }

    const item = this.itemRepository.findOne({
      where: { id: dto.itemId },
    });

    if (!item) {
      return 'Item not found.';
    }

    // sender logic
    let senderCharItem = await this.characterItemRepository.findOne({
      where: {
        character: { id: dto.senderCharacterId },
        item: { id: dto.itemId },
      },
      relations: ['character', 'item'],
    });

    if (!senderCharItem) {
      return 'Item doesnt exists for sender character.';
    }
    senderCharItem.decQuantity();

    if (senderCharItem.quantity == 0) {
      await this.characterItemRepository.delete({ id: senderCharItem.id });
    } else {
      await this.characterItemRepository.save(senderCharItem);
    }

    // reciever logic
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
    return true;
  }
}
