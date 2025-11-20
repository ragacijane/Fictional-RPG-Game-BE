import {
  Character,
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
  ) {}

  async findAllCharacters() {
    return await this.characterRepository.find();
  }

  async findeOneCharacter(dto: FindOneCharacterDto) {
    return await this.characterRepository.findOne({
      where: { id: dto.characterId },
    });
  }

  async createCharacter(dto: CreateCharacterDto) {
    const newCharacter = this.characterRepository.create(dto);
    await this.characterRepository.save(newCharacter);
    return newCharacter.id;
  }

  async findAllItems() {
    return this.itemRepository.find();
  }

  async findOneItem(dto: FindOneItemDto) {
    return this.itemRepository.findOne({
      where: { id: dto.itemId },
    });
  }

  async createItem(dto: CreateItemDto) {
    const newItem = this.itemRepository.create(dto);
    await this.itemRepository.save(newItem);
    return newItem.id;
  }

  async grantItem(dto: GrantItemsDto) {
    console.log('Grant Item DTO:', dto);
    return true;
  }

  async giftItem(dto: GiftItemsDto) {
    console.log('Gift Item DTO:', dto);
    return true;
  }
}
