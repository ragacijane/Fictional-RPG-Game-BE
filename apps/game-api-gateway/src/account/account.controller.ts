import { Controller, Get } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('api/account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get()
  findAll() {
    return this.accountService.findAll();
  }
}
