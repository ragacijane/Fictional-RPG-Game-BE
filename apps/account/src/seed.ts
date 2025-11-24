import 'reflect-metadata';
import AccountDataSource from '../typeorm.config';
import { Account, AccountRole } from '@game-domain';
import * as bcrypt from 'bcrypt';

async function seed() {
  await AccountDataSource.initialize();

  const repository = AccountDataSource.getRepository(Account);

  const count = await repository.count();
  if (count > 0) {
    console.log('Accounts already exist, skipping seed.');
    await AccountDataSource.destroy();
    return;
  }
  const passwordAcc1 = await bcrypt.hash(process.env.GM_PASS!, 10);
  const acc1 = repository.create({
    id: process.env.GM_ID,
    email: process.env.GM_EMAIL,
    password: passwordAcc1,
    username: process.env.GM_USER,
    role: AccountRole.GAME_MASTER,
  });
  const passwordAcc2 = await bcrypt.hash('test-password-2', 10);
  const acc2 = repository.create({
    email: 'luka2@test.com',
    password: passwordAcc2,
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
