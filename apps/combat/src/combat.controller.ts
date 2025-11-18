import { Controller, Get } from '@nestjs/common';
import { CombatService } from './combat.service';

@Controller()
export class CombatController {
  constructor(private readonly combatService: CombatService) {}

  @Get()
  getHello(): string {
    return this.combatService.getHello();
  }
}
