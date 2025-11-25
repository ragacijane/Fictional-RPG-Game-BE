import { CombatAction } from '../enums/combat-action.enum';

export type CreateDuelBody = {
  characterOneId: string;
  characterTwoId: string;
};

export type CreateDuelDto = CreateDuelBody & {
  accountId: string;
};

export type DuelActionDto = {
  action: CombatAction;
  characterId: string;
  duelId: string;
};
