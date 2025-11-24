import { Body, Controller, Get, Post } from '@nestjs/common';
import { AccountAPIService } from './account.service';
import { LoginDto, RegisterDto } from '@game-domain';

@Controller()
export class AccountAPIController {
  constructor(private accountService: AccountAPIService) {}

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.accountService.login(body);
  }

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.accountService.register(body);
  }
}
