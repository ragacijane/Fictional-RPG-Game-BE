import { Controller, Get } from '@nestjs/common';
import { CharacterService } from './character.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateCharacterDto, FindOneCharacterDto } from '@game-domain';
import {
  CreateItemDto,
  FindOneItemDto,
  GiftItemsDto,
  GrantItemsDto,
} from 'libs/game-domain/src/dtos/item.dto';

@Controller()
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @MessagePattern('character.findAll')
  async findAllCharacters() {
    return this.characterService.findAllCharacters();
  }

  @MessagePattern('character.findOne')
  async findOneCharacter(dto: FindOneCharacterDto) {
    return this.characterService.findeOneCharacter(dto);
  }

  @MessagePattern('character.create')
  async createCharacter(dto: CreateCharacterDto) {
    return this.characterService.createCharacter(dto);
  }

  @MessagePattern('items.findAll')
  async findAllItems() {
    return this.characterService.findAllItems();
  }

  @MessagePattern('items.findOne')
  async findOneItem(dto: FindOneItemDto) {
    return this.characterService.findOneItem(dto);
  }

  @MessagePattern('items.create')
  async createItem(dto: CreateItemDto) {
    return this.characterService.createItem(dto);
  }

  @MessagePattern('items.grant')
  async grantItem(dto: GrantItemsDto) {
    return this.characterService.grantItem(dto);
  }

  @MessagePattern('items.gift')
  async giftItem(dto: GiftItemsDto) {
    return this.characterService.giftItem(dto);
  }
}
