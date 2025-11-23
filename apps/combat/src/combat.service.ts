import {
  Character,
  CharacterItem,
  Class,
  CreateDuelDto,
  Duel,
  DuelActionDto,
  Item,
} from '@game-domain';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class CombatService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(CharacterItem)
    private readonly characterItemRepository: Repository<CharacterItem>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Duel)
    private readonly duelRepository: Repository<Duel>,
    @Inject('CHARACTER_CLIENT')
    private readonly characterClient: ClientProxy,
  ) {}
  // TODO:
  /**
   * Check if any of characters are in active duel
   * Sync characters
   * Notify character service that characters are in duel
   */
  async createDuel(dto: CreateDuelDto) {
    try {
      const characterOne = await firstValueFrom(
        this.characterClient.send('character.findOne', {
          characterId: dto.characterOneId,
          isGameMaster: true,
          accountId: '',
        }),
      );

      console.log(characterOne);

      // const newDuel = this.duelRepository.create({
      //   ...dto,
      //   maxDuelDuration: new Date(Date.now() + 5 * 60 * 1000),
      // });

      // await this.duelRepository.save(newDuel);
      // return newDuel.id;
      return true;
    } catch (err: any) {
      console.log('Error:', err);
      if (err?.response && err?.status) {
        throw new RpcException({
          statusCode: err.response.statusCode ?? err.status,
          message: err.response.message ?? err.message,
        });
      }

      throw new RpcException({
        statusCode: 500,
        message: err?.message ?? 'Internal error in CombatService',
      });
    }
  }

  async duelAction(dto: DuelActionDto) {
    console.log(dto);
    return true;
  }
}
