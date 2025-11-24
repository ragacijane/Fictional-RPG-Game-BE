import { NestFactory } from '@nestjs/core';
import { AccountModule } from './account.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AccountModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: Number(process.env.ACCOUNT_PORT),
      },
    },
  );
  await app.listen();
}
bootstrap();
