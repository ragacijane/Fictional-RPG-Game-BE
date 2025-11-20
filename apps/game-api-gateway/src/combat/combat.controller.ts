import { Controller, Get } from '@nestjs/common';
import { CombatService } from './combat.service';

@Controller('api/combat')
export class CombatController {
  constructor(private combatService: CombatService) {}
  @Get()
  findAll() {
    return this.combatService.findAll();
  }
}
