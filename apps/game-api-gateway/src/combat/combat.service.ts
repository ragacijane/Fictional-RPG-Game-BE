import { COMBAT_CLIENT, CreateDuelDto, DuelActionDto } from '@game-domain';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CharacterAPIService } from '../character/character.service';

@Injectable()
export class CombatAPIService {
  constructor(
    @Inject(COMBAT_CLIENT)
    private readonly combatClient: ClientProxy,
    private readonly characterService: CharacterAPIService,
  ) {}

  async createDuel(dto: CreateDuelDto) {
    await this.characterService.invalidateCharacterCache(dto.characterOneId);

    return this.combatClient.send('combat.create', dto);
  }

  duelAction(dto: DuelActionDto) {
    return this.combatClient.send('combat.action', dto);
  }
}
