import { Character, CreateDuelDto, Duel, DuelActionDto } from '@game-domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CombatService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    @InjectRepository(Duel)
    private readonly duelRepository: Repository<Duel>,
  ) {}
  // TODO:
  /**
   * Check if any of characters are in active duel
   * Sync characters
   * Notify character service that characters are in duel
   */
  async createDuel(dto: CreateDuelDto) {
    const newDuel = this.duelRepository.create(dto);
    await this.duelRepository.save(newDuel);
    return newDuel.id;
  }

  async duelAction(dto: DuelActionDto) {
    console.log(dto);
    return true;
  }
}
