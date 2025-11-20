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

export type GrantItemsDto = {
  characterId: string;
  itemId: string;
};

export type GiftItemsDto = {
  senderCharacterId: string;
  recieverCharacterId: string;
  itemId: string;
};
