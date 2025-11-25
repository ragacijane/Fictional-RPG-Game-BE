import { COMBAT_CLIENT, CreateDuelDto, DuelActionDto } from '@game-domain';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CharacterAPIService } from '../character/character.service';
import { firstValueFrom } from 'rxjs';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class CombatAPIService {
  constructor(
    @Inject(COMBAT_CLIENT)
    private readonly combatClient: ClientProxy,
    private readonly characterService: CharacterAPIService,
  ) {}

  async createDuel(dto: CreateDuelDto) {
    if (!uuidValidate(dto.characterOneId)) {
      throw new BadRequestException(`Id is invalid ${dto.characterOneId}`);
    }
    if (!uuidValidate(dto.characterTwoId)) {
      throw new BadRequestException(`Id is invalid ${dto.characterTwoId}`);
    }
    try {
      return await firstValueFrom(this.combatClient.send('combat.create', dto));
    } catch (error) {
      throw error;
    }
  }

  async duelAction(dto: DuelActionDto) {
    if (!uuidValidate(dto.characterId)) {
      throw new BadRequestException(`Id is invalid ${dto.characterId}`);
    }
    if (!uuidValidate(dto.duelId)) {
      throw new BadRequestException(`Id is invalid ${dto.duelId}`);
    }
    try {
      return await firstValueFrom(this.combatClient.send('combat.action', dto));
    } catch (error) {
      throw error;
    }
  }
}
