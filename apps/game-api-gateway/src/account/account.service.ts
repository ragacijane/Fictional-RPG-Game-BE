import { ACCOUNT_CLIENT, LoginDto, RegisterDto } from '@game-domain';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AccountAPIService {
  constructor(
    @Inject(ACCOUNT_CLIENT)
    private readonly accountClient: ClientProxy,
  ) {}

  async login(dto: LoginDto) {
    try {
      const access_token = await firstValueFrom(
        this.accountClient.send('account.login', dto),
      );
      return { access_token };
    } catch (error) {
      throw error;
    }
  }

  async register(dto: RegisterDto) {
    try {
      await firstValueFrom(this.accountClient.send('account.register', dto));
    } catch (error) {
      throw error;
    }
  }
}
