import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CombatAPIService } from './combat.service';
import {
  CombatAction,
  CreateDuelBody,
  CreateDuelDto,
  DuelActionDto,
} from '@game-domain';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class CombatAPIController {
  constructor(private combatService: CombatAPIService) {}
  @Post('challange')
  createDuel(@Req() req, @Body() body: CreateDuelBody) {
    const dto: CreateDuelDto = {
      ...body,
      accountId: req.user.accountId,
    };
    return this.combatService.createDuel(dto);
  }

  @Post(':duelId/:action')
  duelAttack(
    @Req() req,
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
      accountId: req.user.accountId,
    };
    return this.combatService.duelAction(dto);
  }
}
