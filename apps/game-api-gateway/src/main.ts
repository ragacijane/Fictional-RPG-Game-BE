import { NestFactory } from '@nestjs/core';
import { GameApiGatewayModule } from './game-api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GameApiGatewayModule);
  app.setGlobalPrefix('api');
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
