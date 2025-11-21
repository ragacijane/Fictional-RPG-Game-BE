import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CombatService } from './combat.service';
import { CombatAction, CreateDuelDto, DuelActionDto } from '@game-domain';

@Controller()
export class CombatController {
  constructor(private combatService: CombatService) {}
  @Post('challange')
  createDuel(@Body() body: CreateDuelDto) {
    return this.combatService.createDuel(body);
  }

  @Post(':duelId/:action')
  duelAttack(
    @Param('duelId') duelId: string,
    @Param('action') action: string,
    @Body() body: { characterId: string },
  ) {
    let actionEnum: CombatAction | null = null;

    switch (action) {
      case 'attack': {
        actionEnum = CombatAction.ATTACK;
        break;
      }
      case 'cast': {
        actionEnum = CombatAction.CAST;
        break;
      }
      case 'heal': {
        actionEnum = CombatAction.HEAL;
        break;
      }
    }

    if (!actionEnum) {
      throw new Error('Invalid duel action');
    }

    const dto: DuelActionDto = {
      duelId,
      characterId: body.characterId,
      action: actionEnum,
    };
    return this.combatService.duelAction(dto);
  }
}
