import { Controller, Get } from '@nestjs/common';
import { CombatService } from './combat.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class CombatController {
  constructor(private readonly combatService: CombatService) {}

  @MessagePattern('combat.findAll')
  async findAll() {
    return this.combatService.findAll();
  }
}
