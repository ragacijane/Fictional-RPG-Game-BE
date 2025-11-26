import { IsUUID, IsNotEmpty } from 'class-validator';

export class FindOneItemDto {
  @IsNotEmpty()
  @IsUUID()
  itemId: string;
  @IsNotEmpty()
  @IsUUID()
  accountId: string;
}

export class CreateItemDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  bonusStrength: number;
  @IsNotEmpty()
  bonusAgility: number;
  @IsNotEmpty()
  bonusIntelligence: number;
  @IsNotEmpty()
  bonusFaith: number;
}

export class GrantItemBody {
  @IsNotEmpty()
  @IsUUID()
  characterId: string;
  @IsNotEmpty()
  @IsUUID()
  itemId: string;
}

export type GrantItemsDto = GrantItemBody & {
  accountId: string;
};

export class GiftItemsBody {
  @IsNotEmpty()
  @IsUUID()
  senderCharacterId: string;
  @IsNotEmpty()
  @IsUUID()
  recieverCharacterId: string;
  @IsNotEmpty()
  @IsUUID()
  itemId: string;
}

export type GiftItemsDto = GiftItemsBody & {
  accountId: string;
};

export type ItemReadType = {
  id: string;
  name: string;
  description: string;
  bonusStrength: number;
  bonusAgility: number;
  bonusIntelligence: number;
  bonusFaith: number;
};
