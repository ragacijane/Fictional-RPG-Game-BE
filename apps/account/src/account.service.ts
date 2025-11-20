import { Injectable } from '@nestjs/common';
import { AccountDto } from './dto/account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async findAll() {
    return await this.accountRepository.find();
  }
}
