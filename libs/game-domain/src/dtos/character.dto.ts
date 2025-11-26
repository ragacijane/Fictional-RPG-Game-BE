import { IsNotEmpty, IsUUID } from 'class-validator';
import { ItemReadType } from './item.dto';

export class FindOneCharacterDto {
  @IsNotEmpty()
  @IsUUID()
  accountId: string;
  @IsNotEmpty()
  @IsUUID()
  characterId: string;
  @IsNotEmpty()
  @IsUUID()
  isGameMaster: boolean;
}

export class CreateCharacterBody {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  health: number;
  @IsNotEmpty()
  mana: number;
  @IsNotEmpty()
  baseStrength: number;
  @IsNotEmpty()
  baseAgility: number;
  @IsNotEmpty()
  baseIntelligence: number;
  @IsNotEmpty()
  baseFaith: number;
  @IsNotEmpty()
  classId: string;
}

export type CreateCharacterDto = CreateCharacterBody & {
  ownerId: string;
};

export type AllCharactersListDto = {
  id: string;
  name: string;
  health: number;
  mana: number;
};

export type CharacterReadType = {
  id: string;
  name: string;
  health: number;
  mana: number;
  strength: number;
  agility: number;
  intelligence: number;
  faith: number;
  inCombat: boolean;
  className: string;
  items: ItemReadType[];
};
