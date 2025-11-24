import { Controller, Get } from '@nestjs/common';
import { AccountService } from './account.service';
import { MessagePattern } from '@nestjs/microservices';
import { LoginDto, RegisterDto } from '@game-domain';

@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @MessagePattern('account.login')
  login(dto: LoginDto) {
    console.log('Logging In');
    return this.accountService.login(dto);
  }

  @MessagePattern('account.register')
  register(dto: RegisterDto) {
    return this.accountService.register(dto);
  }
}
