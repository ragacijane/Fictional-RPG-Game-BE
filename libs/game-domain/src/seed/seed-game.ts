import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Character, Class, Item, CharacterItem, ClassName } from '@game-domain';

export async function seedGameDomain(dataSource: DataSource) {
  await dataSource.initialize();

  const classRepo = dataSource.getRepository(Class);
  const itemRepo = dataSource.getRepository(Item);
  const characterRepo = dataSource.getRepository(Character);
  const charItemRepo = dataSource.getRepository(CharacterItem);

  const existingChars = await characterRepo.count();
  if (existingChars > 0) {
    console.log(`${dataSource.options.database} already seeded, skipping.`);
    await dataSource.destroy();
    return;
  }

  const warrior = classRepo.create({
    name: ClassName.WARRIOR,
    description: 'Frontline fighter with high strength.',
  });

  const mage = classRepo.create({
    name: ClassName.MAGE,
    description: 'Spellcaster with high intelligence.',
  });

  await classRepo.save([warrior, mage]);

  const sword = itemRepo.create({
    name: 'Steel Sword',
    description: 'A basic steel sword.',
    bonusStrength: 5,
    bonusAgility: 1,
    bonusIntelligence: 0,
    bonusFaith: 0,
  });

  await itemRepo.save(sword);

  const hero = characterRepo.create({
    name: 'HeroOne',
    health: 100,
    mana: 50,
    baseStrength: 10,
    baseAgility: 5,
    baseIntelligence: 3,
    baseFaith: 2,
  });

  hero['classId'] = warrior.id;

  await characterRepo.save(hero);

  const ci1 = charItemRepo.create({
    characterId: hero.id,
    itemId: sword.id,
  });

  const ci2 = charItemRepo.create({
    characterId: hero.id,
    itemId: sword.id,
  });

  await charItemRepo.save([ci1, ci2]);

  console.log(`${dataSource.options.database} seeded successfully.`);
  await dataSource.destroy();
}
