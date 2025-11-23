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
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class CharacterService {
  constructor(
    @Inject('CHARACTER_CLIENT')
    private readonly characterClient: ClientProxy,
    @Inject('CACHE_MANAGER')
    private readonly cache: Cache,
  ) {}

  findAllCharacters() {
    console.log('Following find all characters to Character service');
    try {
      return this.characterClient.send('character.findAll', {});
    } catch (error) {
      throw error;
    }
  }

  async findOneCharacter(dto: FindOneCharacterDto) {
    console.log('Following find character to Character service');

    const cached = await this.cache.get(dto.characterId);

    if (cached) {
      console.log('Retrieved from cache');
      return cached;
    }
    try {
      const character = await firstValueFrom(
        this.characterClient.send('character.findOne', dto),
      );

      await this.cache.set(dto.characterId, character, 60000);
      console.log(`Successfully cached ${dto.characterId}`);
      return character;
    } catch (error) {
      throw error;
    }
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

  async grantItem(dto: GrantItemsDto) {
    console.log('Following grant item to Character service');

    const response = await firstValueFrom(
      this.characterClient.send('items.grant', dto),
    );

    await this.invalidateCharacterCache(dto.characterId);

    return response;
  }

  async giftItem(dto: GiftItemsDto) {
    console.log('Following gift item to Character service');

    const response = await firstValueFrom(
      this.characterClient.send('items.gift', dto),
    );

    await this.invalidateCharacterCache(dto.senderCharacterId);
    await this.invalidateCharacterCache(dto.recieverCharacterId);

    return response;
  }

  async invalidateCharacterCache(characterId: string) {
    await this.cache.del(characterId);
  }
}
