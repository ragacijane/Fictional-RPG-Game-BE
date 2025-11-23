import { NestFactory } from '@nestjs/core';
import { GameApiGatewayModule } from './game-api-gateway.module';
import { AllExceptionsFilter } from './interceptors/all-exceptions-filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(GameApiGatewayModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
