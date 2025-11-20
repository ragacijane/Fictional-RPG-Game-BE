import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ACCOUNT_CLIENT',
        transport: Transport.TCP,
        options: {
          host: 'account',
          port: 3001,
        },
      },
    ]),
  ],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
