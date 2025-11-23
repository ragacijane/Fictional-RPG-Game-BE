import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CharacterService } from './character.service';
import {
  AccountRole,
  CreateCharacterBody,
  CreateCharacterDto,
  FindOneCharacterDto,
} from '@game-domain';
import {
  CreateItemDto,
  FindOneItemDto,
  GiftItemsBody,
  GiftItemsDto,
  GrantItemBody,
  GrantItemsDto,
} from 'libs/game-domain/src/dtos/item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class CharacterController {
  constructor(private characterService: CharacterService) {}

  @Get('character')
  findAllcharacters(@Req() req) {
    if (req.user.role != AccountRole.GAME_MASTER) {
      throw new BadRequestException('Only GameMaster can call this EP.');
    }
    return this.characterService.findAllCharacters();
  }

  @Get('character/:id')
  findOneCharacter(@Req() req, @Param('id') id: string) {
    const dto: FindOneCharacterDto = {
      accountId: req.user.accountId,
      characterId: id,
      isGameMaster: req.user.role == AccountRole.GAME_MASTER,
    };
    return this.characterService.findOneCharacter(dto);
  }

  @Post('character')
  createCharacter(@Req() req, @Body() body: CreateCharacterBody) {
    const dto: CreateCharacterDto = {
      ...body,
      ownerId: req.user.accountId,
    };
    return this.characterService.createCharacter(dto);
  }

  @Get('items')
  findAllItems(@Req() req) {
    if (req.user.role != AccountRole.GAME_MASTER) {
      throw new BadRequestException('Only GameMaster can call this EP.');
    }
    return this.characterService.findAllItems();
  }

  @Get('items/:id')
  findOneItem(@Req() req, @Param('id') id: string) {
    const dto: FindOneItemDto = {
      accountId: req.user.accountId,
      itemId: id,
    };
    return this.characterService.findOneItem(dto);
  }

  @Post('items')
  createItems(@Body() body: CreateItemDto) {
    return this.characterService.createItem(body);
  }

  @Post('items/grant')
  grantItems(@Req() req, @Body() body: GrantItemBody) {
    const dto: GrantItemsDto = {
      ...body,
      accountId: req.user.accountId,
    };
    return this.characterService.grantItem(dto);
  }

  @Post('items/gift')
  giftItems(@Req() req, @Body() body: GiftItemsBody) {
    const dto: GiftItemsDto = {
      ...body,
      accountId: req.user.accountId,
    };
    return this.characterService.giftItem(dto);
  }
}
