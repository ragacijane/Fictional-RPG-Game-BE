import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterDto, FindOneCharacterDto } from '@game-domain';
import {
  CreateItemDto,
  FindOneItemDto,
  GiftItemsDto,
  GrantItemsDto,
} from 'libs/game-domain/src/dtos/item.dto';

@Controller('')
export class CharacterController {
  constructor(private characterService: CharacterService) {}

  @Get('character')
  findAllcharacters() {
    return this.characterService.findAllCharacters();
  }

  @Get('character/:id')
  findOneCharacter(@Param('id') id: string) {
    const dto: FindOneCharacterDto = {
      accountId: 'testAcc',
      characterId: id,
    };
    return this.characterService.findOneCharacter(dto);
  }

  @Post('character')
  createCharacter(@Body() body: CreateCharacterDto) {
    return this.characterService.createCharacter(body);
  }

  @Get('items')
  findAllItems() {
    return this.characterService.findAllItems();
  }

  @Get('items/:id')
  findOneItem(@Param('id') id: string) {
    const dto: FindOneItemDto = {
      accountId: 'testAcc',
      itemId: id,
    };
    return this.characterService.findOneItem(dto);
  }

  @Post('items')
  createItems(@Body() body: CreateItemDto) {
    return this.characterService.createItem(body);
  }

  @Post('items/grant')
  grantItems(@Body() body: GrantItemsDto) {}

  @Post('items/gift')
  giftItems(@Body() body: GiftItemsDto) {}
}
