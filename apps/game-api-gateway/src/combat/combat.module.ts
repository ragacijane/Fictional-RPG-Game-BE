import { Module } from '@nestjs/common';
import { CombatService } from './combat.service';
import { CombatController } from './combat.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    // TODO: Put into env/const
    ClientsModule.register([
      {
        name: 'COMBAT_CLIENT',
        transport: Transport.TCP,
        options: {
          host: 'combat',
          port: 3003,
        },
      },
    ]),
  ],
  providers: [CombatService],
  controllers: [CombatController],
})
export class CombatModule {}
