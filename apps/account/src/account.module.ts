import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { Account, RpcErrorInterceptor } from '@game-domain';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.ACCOUNT_DB_HOST,
      port: Number(process.env.ACCOUNT_DB_PORT),
      username: process.env.ACCOUNT_DB_USER,
      password: process.env.ACCOUNT_DB_PASS,
      database: process.env.ACCOUNT_DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Account]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '10h' },
    }),
  ],
  controllers: [AccountController],
  providers: [
    AccountService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RpcErrorInterceptor,
    },
  ],
})
export class AccountModule {}
