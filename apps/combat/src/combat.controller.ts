import { Controller } from '@nestjs/common';
import { CombatService } from './combat.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateDuelDto, DuelActionDto } from '@game-domain';

@Controller()
export class CombatController {
  constructor(private readonly combatService: CombatService) {}

  @MessagePattern('combat.create')
  async createDuel(dto: CreateDuelDto) {
    return this.combatService.createDuel(dto);
  }

  @MessagePattern('combat.action')
  async duelAction(dto: DuelActionDto) {
    return this.combatService.duelAction(dto);
  }
}
