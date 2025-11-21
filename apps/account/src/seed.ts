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
    id: '511acdbd-97e8-4b91-bebc-0504ba03f56d',
    email: 'admin@game.com',
    passwordHash: 'test-password-1',
    username: 'admin',
    role: AccountRole.GAME_MASTER,
  });

  const acc2 = repository.create({
    email: 'luka2@test.com',
    passwordHash: 'test-password-2',
    username: 'lukaTest2',
  });

  await repository.save([acc1, acc2]);

  console.log('Seed completed!');
  await AccountDataSource.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
