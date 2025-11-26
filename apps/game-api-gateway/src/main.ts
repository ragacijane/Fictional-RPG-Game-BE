import { NestFactory } from '@nestjs/core';
import { GameApiGatewayModule } from './game-api-gateway.module';
import { AllExceptionsFilter } from './interceptors/all-exceptions-filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(GameApiGatewayModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.GAME_API_PORT ?? 3000);
}
bootstrap();
