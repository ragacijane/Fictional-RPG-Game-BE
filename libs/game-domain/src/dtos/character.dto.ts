import { ItemReadType } from './item.dto';

export type FindOneCharacterDto = {
  accountId: string;
  characterId: string;
  isGameMaster: boolean;
};

export type CreateCharacterBody = {
  name: string;
  health: number;
  mana: number;
  baseStrength: number;
  baseAgility: number;
  baseIntelligence: number;
  baseFaith: number;
  classId: string;
};

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
