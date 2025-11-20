import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CharacterService {
  constructor(
    @Inject('CHARACTER_CLIENT')
    private readonly characterClient: ClientProxy,
  ) {}
  findAll() {
    return this.characterClient.send('character.findAll', {});
  }
}
