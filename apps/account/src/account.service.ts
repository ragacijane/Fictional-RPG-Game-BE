import { Injectable } from '@nestjs/common';
import { AccountDto } from './dto/account.dto';

@Injectable()
export class AccountService {
  private accounts: AccountDto[] = [
    {
      username: 'Test1',
      password: 'Pass1',
      role: 'GameMaster',
    },
    {
      username: 'Test2',
      password: 'Pass2',
      role: 'Standard',
    },
  ];

  findAll(): AccountDto[] {
    return this.accounts;
  }
}
