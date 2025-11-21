import { Body, Controller, Get, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { LoginDto, RegisterDto } from '@game-domain';

@Controller()
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.accountService.login(body);
  }

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.accountService.register(body);
  }
}
