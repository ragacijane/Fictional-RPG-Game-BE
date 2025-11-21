import { CombatAction } from '../enums/combat-action.enum';

export type CreateDuelDto = {
  characterOneId: string;
  characterTwoId: string;
};

export type DuelActionDto = {
  action: CombatAction;
  characterId: string;
  duelId: string;
};
