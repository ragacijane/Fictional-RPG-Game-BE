import { IsNotEmpty, IsUUID } from 'class-validator';
import { CombatAction } from '../enums/combat-action.enum';

export class CreateDuelBody {
  @IsNotEmpty()
  @IsUUID()
  characterOneId: string;
  @IsNotEmpty()
  @IsUUID()
  characterTwoId: string;
}

export type CreateDuelDto = CreateDuelBody & {
  accountId: string;
};

export class DuelActionDto {
  @IsNotEmpty()
  action: CombatAction;
  @IsNotEmpty()
  @IsUUID()
  characterId: string;
  @IsNotEmpty()
  @IsUUID()
  duelId: string;
  @IsNotEmpty()
  @IsUUID()
  accountId: string;
}

export type DuelActionResponse = {
  isFinished: boolean;
  actor: string;
  actorHealth: number;
  opponent: string;
  opponentHealth: number;
};
