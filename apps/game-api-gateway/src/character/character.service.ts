import { CreateCharacterDto, FindOneCharacterDto } from '@game-domain';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateItemDto,
  FindOneItemDto,
  GiftItemsDto,
  GrantItemsDto,
} from 'libs/game-domain/src/dtos/item.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CharacterService {
  constructor(
    @Inject('CHARACTER_CLIENT')
    private readonly characterClient: ClientProxy,
  ) {}

  findAllCharacters() {
    console.log('Following find all characters to Character service');
    return this.characterClient.send('character.findAll', {});
  }

  async findOneCharacter(dto: FindOneCharacterDto) {
    console.log('Following find character to Character service');
    const character = await firstValueFrom(
      this.characterClient.send('character.findOne', dto),
    );

    if (!character) {
      return 'Character not found';
    }
    return character;
  }

  createCharacter(dto: CreateCharacterDto) {
    console.log('Following create character to Character service');
    return this.characterClient.send('character.create', dto);
  }

  findAllItems() {
    console.log('Following find all items to Character service');
    return this.characterClient.send('items.findAll', {});
  }

  findOneItem(dto: FindOneItemDto) {
    console.log('Following find item to Character service');
    return this.characterClient.send('items.findOne', dto);
  }

  createItem(dto: CreateItemDto) {
    console.log('Following create item to Character service');
    return this.characterClient.send('items.create', dto);
  }

  grantItem(dto: GrantItemsDto) {
    console.log('Following grant item to Character service');
    return this.characterClient.send('items.grant', dto);
  }

  giftItem(dto: GiftItemsDto) {
    console.log('Following gift item to Character service');
    return this.characterClient.send('items.gift', dto);
  }
}
