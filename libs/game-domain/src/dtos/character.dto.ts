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
