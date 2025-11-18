import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AccountService {
  constructor(
    @Inject('ACCOUNT_CLIENT')
    private readonly accountClient: ClientProxy,
  ) {}
  findAll() {
    return this.accountClient.send('account.findAll', {});
  }
}
