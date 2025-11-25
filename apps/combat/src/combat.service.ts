import {
  Character,
  CHARACTER_CLIENT,
  CharacterItem,
  Class,
  CreateDuelDto,
  Duel,
  DuelActionDto,
  DuelStatus,
  Item,
} from '@game-domain';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { DataSource, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class CombatService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    @Inject(CHARACTER_CLIENT)
    private readonly characterClient: ClientProxy,
    @InjectRepository(Duel)
    private readonly duelRepository: Repository<Duel>,
    private readonly dataSource: DataSource,
  ) {}
  async createDuel(dto: CreateDuelDto) {
    const now = new Date();

    const activeDuel = await this.duelRepository.findOne({
      where: [
        {
          characterOneId: dto.characterOneId,
          status: DuelStatus.ACTIVE,
          maxDuelDuration: MoreThanOrEqual(now),
        },
        {
          characterTwoId: dto.characterOneId,
          status: DuelStatus.ACTIVE,
          maxDuelDuration: MoreThanOrEqual(now),
        },
        {
          characterOneId: dto.characterTwoId,
          status: DuelStatus.ACTIVE,
          maxDuelDuration: MoreThanOrEqual(now),
        },
        {
          characterTwoId: dto.characterTwoId,
          status: DuelStatus.ACTIVE,
          maxDuelDuration: MoreThanOrEqual(now),
        },
      ],
    });

    if (activeDuel) {
      throw new RpcException(
        new BadRequestException('Characters are already in duel.'),
      );
    }

    try {
      const characterOne = await firstValueFrom(
        this.characterClient.send('character.getRawCharacter', {
          characterId: dto.characterOneId,
          isGameMaster: false,
          accountId: dto.accountId,
        }),
      );

      const characterTwo = await firstValueFrom(
        this.characterClient.send('character.getRawCharacter', {
          characterId: dto.characterTwoId,
          isGameMaster: true,
          accountId: '',
        }),
      );

      await this.syncCharacters(characterOne, characterTwo);

      const newDuel = this.duelRepository.create({
        ...dto,
        maxDuelDuration: new Date(Date.now() + 5 * 60 * 1000),
      });

      await this.duelRepository.save(newDuel);
      return newDuel.id;
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

  private async syncCharacters(charOne: Character, charTwo: Character) {
    return this.dataSource.transaction(async (manager) => {
      const characterRepo = manager.getRepository(Character);
      const classRepo = manager.getRepository(Class);
      const itemRepo = manager.getRepository(Item);
      const charItemRepo = manager.getRepository(CharacterItem);

      const characters = [charOne, charTwo];

      for (const char of characters) {
        await classRepo.save({
          id: char.class.id,
          name: char.class.name,
          description: char.class.description,
          createdAt: char.class.createdAt,
          updatedAt: char.class.updatedAt,
        });

        await characterRepo.save({
          id: char.id,
          name: char.name,
          health: char.health,
          mana: char.mana,
          baseStrength: char.baseStrength,
          baseAgility: char.baseAgility,
          baseIntelligence: char.baseIntelligence,
          baseFaith: char.baseFaith,
          inCombat: char.inCombat,
          ownerId: char.ownerId,
          classId: char.classId,
          createdAt: char.createdAt,
          updatedAt: char.updatedAt,
        });

        for (const charItem of char.items) {
          await itemRepo.save({
            id: charItem.item.id,
            name: charItem.item.name,
            description: charItem.item.description,
            bonusStrength: charItem.item.bonusStrength,
            bonusAgility: charItem.item.bonusAgility,
            bonusIntelligence: charItem.item.bonusIntelligence,
            bonusFaith: charItem.item.bonusFaith,
            createdAt: charItem.item.createdAt,
            updatedAt: charItem.item.updatedAt,
          });

          await charItemRepo.save({
            id: charItem.id,
            characterId: char.id,
            itemId: charItem.item.id,
            quantity: charItem.quantity,
            createdAt: charItem.createdAt,
            updatedAt: charItem.updatedAt,
          });
        }
      }
    });
  }
}
