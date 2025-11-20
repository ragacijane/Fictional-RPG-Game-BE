import { CreateCharacterDto, FindOneCharacterDto } from '@game-domain';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateItemDto,
  FindOneItemDto,
  GiftItemsDto,
  GrantItemsDto,
} from 'libs/game-domain/src/dtos/item.dto';

@Injectable()
export class CharacterService {
  constructor(
    @Inject('CHARACTER_CLIENT')
    private readonly characterClient: ClientProxy,
  ) {}

  findAllCharacters() {
    return this.characterClient.send('character.findAll', {});
  }

  findOneCharacter(dto: FindOneCharacterDto) {
    return this.characterClient.send('character.findOne', dto);
  }

  createCharacter(dto: CreateCharacterDto) {
    return this.characterClient.send('character.create', dto);
  }

  findAllItems() {
    return this.characterClient.send('items.findAll', {});
  }

  findOneItem(dto: FindOneItemDto) {
    return this.characterClient.send('items.findOne', dto);
  }

  createItem(dto: CreateItemDto) {
    return this.characterClient.send('items.create', dto);
  }

  grantItem(dto: GrantItemsDto) {
    return this.characterClient.send('items.grant', dto);
  }

  giftItem(dto: GiftItemsDto) {
    return this.characterClient.send('items.gift', dto);
  }
}
