import { Module } from '@nestjs/common';
import { CombatController } from './combat.controller';
import { CombatService } from './combat.service';

@Module({
  imports: [],
  controllers: [CombatController],
  providers: [CombatService],
})
export class CombatModule {}
