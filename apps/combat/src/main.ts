import { NestFactory } from '@nestjs/core';
import { CombatModule } from './combat.module';

async function bootstrap() {
  const app = await NestFactory.create(CombatModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
