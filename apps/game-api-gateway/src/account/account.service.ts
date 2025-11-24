import { ACCOUNT_CLIENT, LoginDto, RegisterDto } from '@game-domain';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AccountAPIService {
  constructor(
    @Inject(ACCOUNT_CLIENT)
    private readonly accountClient: ClientProxy,
  ) {}

  login(dto: LoginDto) {
    return this.accountClient.send('account.login', dto);
  }

  register(dto: RegisterDto) {
    return this.accountClient.send('account.register', dto);
  }
}
