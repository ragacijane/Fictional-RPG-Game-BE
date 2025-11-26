import {
  COMBAT_CLIENT,
  CreateDuelDto,
  DuelActionDto,
  DuelActionResponse,
} from '@game-domain';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CharacterAPIService } from '../character/character.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CombatAPIService {
  constructor(
    @Inject(COMBAT_CLIENT)
    private readonly combatClient: ClientProxy,
    private readonly characterService: CharacterAPIService,
  ) {}

  async createDuel(dto: CreateDuelDto) {
    try {
      return await firstValueFrom(this.combatClient.send('combat.create', dto));
    } catch (error) {
      throw error;
    }
  }

  async duelAction(dto: DuelActionDto) {
    try {
      const result: DuelActionResponse = await firstValueFrom(
        this.combatClient.send('combat.action', dto),
      );
      if (result.isFinished) {
        await this.characterService.invalidateCharacterCache(result.actor);
        await this.characterService.invalidateCharacterCache(result.opponent);
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}
