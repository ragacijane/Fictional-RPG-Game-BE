import { Controller, Get } from '@nestjs/common';
import { CharacterService } from './character.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @MessagePattern('character.findAll')
  async findAll() {
    return this.characterService.findAll();
  }
}
