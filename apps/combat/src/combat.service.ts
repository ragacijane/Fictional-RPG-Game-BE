import { Injectable } from '@nestjs/common';

@Injectable()
export class CombatService {
  getHello(): string {
    return 'Hello World!';
  }
}
