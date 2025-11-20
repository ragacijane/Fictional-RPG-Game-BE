export type FindOneCharacterDto = {
  accountId: string;
  characterId: string;
};

export type CreateCharacterDto = {
  name: string;
  health: number;
  mana: number;
  baseStrength: number;
  baseAgility: number;
  baseIntelligence: number;
  baseFaith: number;
  classId: string;
};
