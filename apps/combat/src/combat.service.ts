import {
  ATTACK_AVAILABILITY,
  CAST_AVAILABILITY,
  Character,
  CHARACTER_CLIENT,
  CharacterItem,
  Class,
  CombatAction,
  CreateDuelDto,
  Duel,
  DuelActionDto,
  DuelActionResponse,
  DuelStatus,
  GiftItemsDto,
  HEAL_AVAILABILITY,
  Item,
} from '@game-domain';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async duelAction(dto: DuelActionDto): Promise<DuelActionResponse> {
    const now = new Date();

    const mainCharacter = await this.characterRepository.findOne({
      where: { id: dto.characterId, ownerId: dto.accountId },
    });
    if (!mainCharacter) {
      throw new RpcException(
        new NotFoundException(
          `Character with id ${dto.characterId} doesnt exists for this account.`,
        ),
      );
    }

    const duel = await this.duelRepository.findOne({
      where: [
        {
          characterOneId: dto.characterId,
          status: DuelStatus.ACTIVE,
          maxDuelDuration: MoreThanOrEqual(now),
        },
        {
          characterTwoId: dto.characterId,
          status: DuelStatus.ACTIVE,
          maxDuelDuration: MoreThanOrEqual(now),
        },
      ],
    });

    if (!duel) {
      throw new RpcException(
        new NotFoundException('There is no active duel for this character.'),
      );
    }
    let opponentIndex = 1;
    let lastAttack: Date | null = duel.lastAttackCharacterOneAt;
    let lastCast: Date | null = duel.lastCastCharacterOneAt;
    let lastHeal: Date | null = duel.lastHealCharacterOneAt;
    let opponentCharacter = duel.characterOne;

    if (duel.characterOneId == dto.characterId) {
      opponentIndex = 2;
      lastAttack = duel.lastAttackCharacterTwoAt;
      lastCast = duel.lastCastCharacterTwoAt;
      lastHeal = duel.lastHealCharacterTwoAt;
      opponentCharacter = duel.characterTwo;
    }

    let isFinished = false;

    switch (dto.action) {
      case CombatAction.ATTACK: {
        if (
          lastAttack &&
          !this.hasEnoughTimePassed(lastAttack, now, ATTACK_AVAILABILITY)
        ) {
          throw new RpcException(
            new BadRequestException('Attack is not available now.'),
          );
        }
        const charReadType = mainCharacter.getReadType();
        const strength = charReadType.strength;
        const agility = charReadType.agility;
        console.log(`Attacking with power of ${strength + agility}`);
        opponentCharacter.removeHealth(strength + agility);
        if (opponentCharacter.health == 0) {
          isFinished = true;
        }
        if (opponentIndex == 1) {
          duel.lastAttackCharacterOneAt = now;
        } else {
          duel.lastAttackCharacterTwoAt = now;
        }
        break;
      }
      case CombatAction.CAST: {
        if (
          lastCast &&
          !this.hasEnoughTimePassed(lastCast, now, CAST_AVAILABILITY)
        ) {
          throw new RpcException(
            new BadRequestException('Cast is not available now.'),
          );
        }
        opponentCharacter.removeHealth(
          mainCharacter.getReadType().intelligence * 2,
        );
        if (opponentCharacter.health == 0) {
          isFinished = true;
        }
        if (opponentIndex == 1) {
          duel.lastCastCharacterOneAt = now;
        } else {
          duel.lastCastCharacterTwoAt = now;
        }
        break;
      }
      case CombatAction.HEAL: {
        if (
          lastHeal &&
          !this.hasEnoughTimePassed(lastHeal, now, HEAL_AVAILABILITY)
        ) {
          throw new RpcException(
            new BadRequestException('Heal is not available now.'),
          );
        }
        mainCharacter.heal();
        if (opponentIndex == 1) {
          duel.lastHealCharacterOneAt = now;
        } else {
          duel.lastHealCharacterTwoAt = now;
        }
        break;
      }
    }

    await this.dataSource.transaction(async (manager) => {
      const characterRepo = manager.getRepository(Character);
      const duelRepo = manager.getRepository(Duel);

      if (isFinished) {
        try {
          duel.status = DuelStatus.FINISHED;

          const dtoGiftItem: GiftItemsDto = {
            senderCharacterId: opponentCharacter.id,
            recieverCharacterId: mainCharacter.id,
            itemId: opponentCharacter.items[0].itemId,
            accountId: opponentCharacter.ownerId,
          };

          await firstValueFrom(
            this.characterClient.send('character.getRawCharacter', dtoGiftItem),
          );
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

      await characterRepo.save(mainCharacter);
      await characterRepo.save(opponentCharacter);
      await duelRepo.save(duel);
    });

    return {
      isFinished,
      characterOneId: mainCharacter.id,
      characterOneHealth: mainCharacter.health,
      characterTwoId: opponentCharacter.id,
      characterTwoHealth: opponentCharacter.health,
    };
  }

  private hasEnoughTimePassed(
    date1: Date,
    date2: Date,
    seconds: number,
  ): boolean {
    const diffMs = Math.abs(date2.getTime() - date1.getTime());
    const diffSeconds = diffMs / 1000;
    return diffSeconds >= seconds;
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
