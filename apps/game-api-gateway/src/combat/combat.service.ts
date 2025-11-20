import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CombatService {
  constructor(
    @Inject('COMBAT_CLIENT')
    private readonly combatClient: ClientProxy,
  ) {}
  findAll() {
    return this.combatClient.send('combat.findAll', {});
  }
}
