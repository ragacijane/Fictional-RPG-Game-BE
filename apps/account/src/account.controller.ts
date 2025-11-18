import { Controller, Get } from '@nestjs/common';
import { AccountService } from './account.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @MessagePattern('account.findaAll')
  findAll() {
    return this.accountService.findAll();
  }
}
