import {
  CharacterReadType,
  CreateCharacterDto,
  AllCharactersListDto,
  FindOneCharacterDto,
  CHARACTER_CLIENT,
  CACHE_MANAGER,
} from '@game-domain';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
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
export class CharacterAPIService {
  constructor(
    @Inject(CHARACTER_CLIENT)
    private readonly characterClient: ClientProxy,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async findAllCharacters(): Promise<AllCharactersListDto> {
    console.log('Following find all characters to Character service');
    try {
      return await firstValueFrom(
        this.characterClient.send('character.findAll', {}),
      );
    } catch (error) {
      throw error;
    }
  }

  async findOneCharacter(dto: FindOneCharacterDto): Promise<CharacterReadType> {
    console.log('Following find character to Character service');

    const cached = await this.cache.get<CharacterReadType>(dto.characterId);

    if (cached) {
      console.log('Retrieved from cache');
      return cached;
    }
    try {
      const character: CharacterReadType = await firstValueFrom(
        this.characterClient.send('character.findOne', dto),
      );

      await this.cache.set(dto.characterId, character, 60000);

      return character;
    } catch (error) {
      throw error;
    }
  }

  async createCharacter(dto: CreateCharacterDto) {
    console.log('Following create character to Character service');

    try {
      return await firstValueFrom(
        this.characterClient.send('character.create', dto),
      );
    } catch (error) {
      throw error;
    }
  }

  async findAllItems() {
    console.log('Following find all items to Character service');
    try {
      return await firstValueFrom(
        this.characterClient.send('items.findAll', {}),
      );
    } catch (error) {
      throw error;
    }
  }

  async findOneItem(dto: FindOneItemDto) {
    console.log('Following find item to Character service');

    try {
      return await firstValueFrom(
        this.characterClient.send('items.findOne', dto),
      );
    } catch (error) {
      throw error;
    }
  }

  async createItem(dto: CreateItemDto) {
    console.log('Following create item to Character service');
    try {
      return await firstValueFrom(
        this.characterClient.send('items.create', dto),
      );
    } catch (error) {
      throw error;
    }
  }

  async grantItem(dto: GrantItemsDto) {
    console.log('Following grant item to Character service');

    try {
      await firstValueFrom(this.characterClient.send('items.grant', dto));

      await this.invalidateCharacterCache(dto.characterId);
    } catch (error) {
      throw error;
    }
  }

  async giftItem(dto: GiftItemsDto) {
    console.log('Following gift item to Character service');

    try {
      await firstValueFrom(this.characterClient.send('items.gift', dto));

      await this.invalidateCharacterCache(dto.senderCharacterId);
      await this.invalidateCharacterCache(dto.recieverCharacterId);
    } catch (error) {
      throw error;
    }
  }

  async invalidateCharacterCache(characterId: string) {
    console.log(`Invalidating data for characterId ${characterId}`);
    await this.cache.del(characterId);
  }
}
