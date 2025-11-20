import { Controller, Get } from '@nestjs/common';
import { CharacterService } from './character.service';

@Controller('api/character')
export class CharacterController {
  constructor(private characterService: CharacterService) {}
  @Get()
  findAll() {
    return this.characterService.findAll();
  }
}
