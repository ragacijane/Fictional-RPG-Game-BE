import { NestFactory } from '@nestjs/core';
import { CharacterModule } from './character.module';

async function bootstrap() {
  const app = await NestFactory.create(CharacterModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
