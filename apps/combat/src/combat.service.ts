import {
  Character,
  CHARACTER_CLIENT,
  CharacterItem,
  Class,
  CreateDuelDto,
  Duel,
  DuelActionDto,
  DuelActionResponse,
  DuelStatus,
  GiftItemsDto,
  Item,
} from '@game-domain';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { DataSource, MoreThanOrEqual, Repository } from 'typeorm';
import { DuelDomainService } from './domain/duel-domain.service';

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
    private readonly duelDomainService: DuelDomainService,
  ) {}
  async createDuel(dto: CreateDuelDto) {
    const now = new Date();
    // Looking for duel that any character is participating
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
      throw new BadRequestException('Characters are already in duel.');
    }

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

    if (!characterOne.items[0]?.item || !characterTwo.items[0]?.item) {
      throw new Error('Characters need at least 1 item to start a duel.');
    }
    console.log('Sync characters from character service');
    await this.syncCharacters(characterOne, characterTwo);

    const newDuel = this.duelRepository.create({
      ...dto,
      maxDuelDuration: new Date(Date.now() + 5 * 60 * 1000),
    });

    await this.duelRepository.save(newDuel);
    console.log('Duel started');
    return newDuel.id;
  }

  async duelAction(dto: DuelActionDto): Promise<DuelActionResponse> {
    console.log(
      `Starting duel action, fetching characters in duel ${dto.duelId}`,
    );
    const now = new Date();

    const actorCharacter = await this.characterRepository.findOne({
      where: { id: dto.characterId, ownerId: dto.accountId },
    });

    if (!actorCharacter) {
      throw new NotFoundException(
        `Character with id ${dto.characterId} doesnt exists for this account in duel ${dto.duelId}`,
      );
    }
    console.log(
      `Actor character id ${actorCharacter.id} in duel ${dto.duelId}`,
    );

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
      relations: ['characterOne', 'characterTwo'],
    });

    if (!duel) {
      throw new NotFoundException(
        `There is no active duel for this character. in duel ${dto.duelId}`,
      );
    }

    const actor = actorCharacter;
    const opponent =
      duel.characterOneId === dto.characterId
        ? duel.characterTwo
        : duel.characterOne;

    const { isFinished } = this.duelDomainService.applyAction(
      duel,
      actor,
      opponent,
      dto.action,
      now,
    );

    // Saving & gift
    console.log(`Saving data & sending item if needed in duel ${dto.duelId}`);
    await this.dataSource.transaction(async (manager) => {
      const characterRepo = manager.getRepository(Character);
      const duelRepo = manager.getRepository(Duel);
      const index = this.randomInt(opponent.items.length);
      console.log(`Random index is ${index}`);
      if (isFinished) {
        console.log(`Gifting item with id ${opponent.items[index].itemId}`);
        const dtoGiftItem: GiftItemsDto = {
          senderCharacterId: opponent.id,
          recieverCharacterId: actor.id,
          itemId: opponent.items[index].itemId,
          accountId: opponent.ownerId,
        };

        await firstValueFrom(
          this.characterClient.send('items.gift', dtoGiftItem),
        );
      }

      await characterRepo.save(actor);
      await characterRepo.save(opponent);
      await duelRepo.save(duel);
    });
    console.log(`Characters successfully updated! in duel ${dto.duelId}`);
    return {
      isFinished,
      actor: actor.id,
      actorHealth: actor.health,
      opponent: opponent.id,
      opponentHealth: opponent.health,
    };
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

  private randomInt(n: number): number {
    if (n <= 0) {
      throw new Error('n must be a positive integer');
    }
    return Math.floor(Math.random() * n);
  }
}
