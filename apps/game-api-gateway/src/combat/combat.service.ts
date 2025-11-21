import { CreateDuelDto, DuelActionDto } from '@game-domain';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CombatService {
  constructor(
    @Inject('COMBAT_CLIENT')
    private readonly combatClient: ClientProxy,
  ) {}

  createDuel(dto: CreateDuelDto) {
    return this.combatClient.send('combat.create', dto);
  }

  duelAction(dto: DuelActionDto) {
    return this.combatClient.send('combat.action', dto);
  }
}
