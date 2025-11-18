import { Injectable } from '@nestjs/common';

@Injectable()
export class GameApiGatewayService {
  getHello(): string {
    return 'Hello World!';
  }
}
