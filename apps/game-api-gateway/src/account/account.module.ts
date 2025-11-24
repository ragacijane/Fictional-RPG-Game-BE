import { Module } from '@nestjs/common';
import { AccountAPIService } from './account.service';
import { AccountAPIController } from './account.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ACCOUNT_CLIENT } from '@game-domain';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ACCOUNT_CLIENT,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('ACCOUNT_HOST'),
            port: config.get<number>('ACCOUNT_PORT'),
          },
        }),
      },
    ]),
  ],
  providers: [AccountAPIService],
  controllers: [AccountAPIController],
})
export class AccountAPIModule {}
