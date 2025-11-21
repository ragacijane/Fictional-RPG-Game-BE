import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { Account } from '@game-domain';
import { JwtModule } from '@nestjs/jwt';

//TODO: Put in env
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: 'account',
      password: 'account',
      database: 'account_db',
      autoLoadEntities: true,
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Account]),
    JwtModule.register({
      secret: 'JWT-SECRET',
      signOptions: { expiresIn: '10h' },
    }),
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
