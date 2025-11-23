import { CreateDuelDto, DuelActionDto } from '@game-domain';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CharacterService } from '../character/character.service';

@Injectable()
export class CombatService {
  constructor(
    @Inject('COMBAT_CLIENT')
    private readonly combatClient: ClientProxy,
    private readonly characterService: CharacterService,
  ) {}

  async createDuel(dto: CreateDuelDto) {
    await this.characterService.invalidateCharacterCache(dto.characterOneId);

    return this.combatClient.send('combat.create', dto);
  }

  duelAction(dto: DuelActionDto) {
    return this.combatClient.send('combat.action', dto);
  }
}
