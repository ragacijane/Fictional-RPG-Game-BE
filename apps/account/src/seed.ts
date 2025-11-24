import 'reflect-metadata';
import AccountDataSource from '../typeorm.config';
import { Account, AccountRole } from '@game-domain';

async function seed() {
  await AccountDataSource.initialize();

  const repository = AccountDataSource.getRepository(Account);

  const count = await repository.count();
  if (count > 0) {
    console.log('Accounts already exist, skipping seed.');
    await AccountDataSource.destroy();
    return;
  }

  const acc1 = repository.create({
    id: process.env.GM_ID,
    email: process.env.GM_EMAIL,
    password: process.env.GM_PASS,
    username: process.env.GM_USER,
    role: AccountRole.GAME_MASTER,
  });

  const acc2 = repository.create({
    email: 'luka2@test.com',
    password: 'test-password-2',
    username: 'lukaTest2',
  });

  await repository.save([acc1, acc2]);

  console.log('Account DB seed completed!');
  await AccountDataSource.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
