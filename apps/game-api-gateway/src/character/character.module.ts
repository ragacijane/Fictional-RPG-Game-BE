import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    // TODO: Put into env/const
    ClientsModule.register([
      {
        name: 'CHARACTER_CLIENT',
        transport: Transport.TCP,
        options: {
          // host: 'character',
          port: 3002,
        },
      },
    ]),
  ],
  providers: [CharacterService],
  controllers: [CharacterController],
})
export class CharacterModule {}
