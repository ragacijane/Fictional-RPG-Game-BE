export type FindOneItemDto = {
  itemId: string;
  accountId: string;
};

export type CreateItemDto = {
  name: string;
  description: string;
  bonusStrength: number;
  bonusAgility: number;
  bonusIntelligence: number;
  bonusFaith: number;
};

export type GrantItemBody = {
  characterId: string;
  itemId: string;
};

export type GrantItemsDto = GrantItemBody & {
  accountId: string;
};

export type GiftItemsBody = {
  senderCharacterId: string;
  recieverCharacterId: string;
  itemId: string;
};

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
