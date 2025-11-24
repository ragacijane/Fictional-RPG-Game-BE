import { Class, Item, Character, CharacterItem, ClassName } from '@game-domain';
import CharacterDataSource from '../typeorm.config';

async function seed() {
  await CharacterDataSource.initialize();

  const classRepo = CharacterDataSource.getRepository(Class);
  const itemRepo = CharacterDataSource.getRepository(Item);
  const characterRepo = CharacterDataSource.getRepository(Character);
  const charItemRepo = CharacterDataSource.getRepository(CharacterItem);

  const existingChars = await characterRepo.count();
  if (existingChars > 0) {
    console.log(
      `${CharacterDataSource.options.database} already seeded, skipping.`,
    );
    await CharacterDataSource.destroy();
    return;
  }

  const ownerId = process.env.GM_ID;

  // CLASSES
  const warrior = classRepo.create({
    name: ClassName.WARRIOR,
    description: 'Frontline fighter with high strength.',
  });

  const mage = classRepo.create({
    name: ClassName.MAGE,
    description: 'Spellcaster with high intelligence.',
  });

  await classRepo.save([warrior, mage]);

  // ITEMS
  const itemsData = [
    {
      name: 'Steel Sword',
      description: 'A basic steel sword.',
      bonusStrength: 5,
      bonusAgility: 1,
      bonusIntelligence: 0,
      bonusFaith: 0,
    },
    {
      name: 'Iron Shield',
      description: 'A reliable shield forged from iron.',
      bonusStrength: 2,
      bonusAgility: 0,
      bonusIntelligence: 0,
      bonusFaith: 1,
    },
    {
      name: 'Magic Wand',
      description: 'Enhances magical abilities.',
      bonusStrength: 0,
      bonusAgility: 0,
      bonusIntelligence: 5,
      bonusFaith: 2,
    },
    {
      name: 'Leather Boots',
      description: 'Light boots that increase agility.',
      bonusStrength: 0,
      bonusAgility: 3,
      bonusIntelligence: 0,
      bonusFaith: 0,
    },
    {
      name: 'Holy Amulet',
      description: 'Amulet blessed with holy power.',
      bonusStrength: 0,
      bonusAgility: 0,
      bonusIntelligence: 1,
      bonusFaith: 4,
    },
  ];

  const items = itemRepo.create(itemsData);
  await itemRepo.save(items);

  // CHARACTERS
  const hero1 = characterRepo.create({
    name: 'HeroOne',
    health: 100,
    mana: 50,
    baseStrength: 10,
    baseAgility: 5,
    baseIntelligence: 3,
    baseFaith: 2,
    ownerId,
    classId: warrior.id,
  });

  const hero2 = characterRepo.create({
    name: 'MageMaster',
    health: 80,
    mana: 120,
    baseStrength: 3,
    baseAgility: 4,
    baseIntelligence: 12,
    baseFaith: 5,
    ownerId,
    classId: mage.id,
  });

  await characterRepo.save([hero1, hero2]);

  // CHARACTER ITEMS
  const hero1Items = [
    charItemRepo.create({ characterId: hero1.id, itemId: items[0].id }),
    charItemRepo.create({ characterId: hero1.id, itemId: items[1].id }),
  ];

  const hero2Items = [
    charItemRepo.create({ characterId: hero2.id, itemId: items[2].id }),
    charItemRepo.create({ characterId: hero2.id, itemId: items[3].id }),
    charItemRepo.create({ characterId: hero2.id, itemId: items[4].id }),
  ];

  await charItemRepo.save([...hero1Items, ...hero2Items]);

  console.log(`${CharacterDataSource.options.database} seeded successfully.`);
  await CharacterDataSource.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
