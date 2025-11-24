import { Account, LoginDto, RegisterDto } from '@game-domain';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly jwtService: JwtService,
  ) {}
  async login(dto: LoginDto) {
    const account = await this.accountRepository.findOne({
      where: { username: dto.username },
    });

    if (!account) {
      throw new RpcException(new BadRequestException('Account doesnt exists.'));
    }

    const passwordValid = await bcrypt.compare(dto.password, account.password);

    if (!passwordValid) {
      throw new RpcException(new BadRequestException('Invalid password.'));
    }

    const payload = {
      sub: account.id,
      role: account.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return accessToken;
  }

  async register(dto: RegisterDto) {
    const existingAccount = await this.accountRepository.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });

    if (existingAccount) {
      throw new RpcException(
        new BadRequestException(
          'Account with that username/email already exists.',
        ),
      );
    }
    const hashedPass = await bcrypt.hash(dto.password, 10);
    const newAccount = this.accountRepository.create({
      ...dto,
      password: hashedPass,
    });
    await this.accountRepository.save(newAccount);
    return true;
  }
}
