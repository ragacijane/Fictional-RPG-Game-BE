import { Account, LoginDto, RegisterDto } from '@game-domain';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly jwtService: JwtService,
  ) {}
  // TODO:
  /**
   * Implement Errors response
   * Implement Password Hash
   */
  async login(dto: LoginDto) {
    const account = await this.accountRepository.findOne({
      where: { username: dto.username },
    });

    if (!account) {
      return 'Invalid Credentials';
    }

    if (account.password != dto.password) {
      return 'Invalid Credentials';
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
      return false;
    }

    const newAccount = this.accountRepository.create(dto);
    await this.accountRepository.save(newAccount);
    return true;
  }
}
