import {
  ATTACK_AVAILABILITY,
  CAST_AVAILABILITY,
  HEAL_AVAILABILITY,
  CombatAction,
  Duel,
  DuelStatus,
  Character,
} from '@game-domain';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class DuelDomainService {
  hasEnoughTimePassed(date1: Date, date2: Date, seconds: number): boolean {
    const diffMs = Math.abs(date2.getTime() - date1.getTime());
    const diffSeconds = diffMs / 1000;
    return diffSeconds >= seconds;
  }

  applyAction(
    duel: Duel,
    actor: Character,
    opponent: Character,
    action: CombatAction,
    now: Date,
  ): { isFinished: boolean } {
    let isFinished = false;

    const isCharacterOne = duel.characterOneId === actor.id;

    let lastAttack = isCharacterOne
      ? duel.lastAttackCharacterOneAt
      : duel.lastAttackCharacterTwoAt;

    let lastCast = isCharacterOne
      ? duel.lastCastCharacterOneAt
      : duel.lastCastCharacterTwoAt;

    let lastHeal = isCharacterOne
      ? duel.lastHealCharacterOneAt
      : duel.lastHealCharacterTwoAt;

    switch (action) {
      case CombatAction.ATTACK: {
        if (
          lastAttack &&
          !this.hasEnoughTimePassed(lastAttack, now, ATTACK_AVAILABILITY)
        ) {
          throw new BadRequestException('Attack is not available now.');
        }

        const charReadType = actor.getReadType();
        const power = charReadType.strength + charReadType.agility;
        console.log(`Attacking with power of ${power}`);
        opponent.removeHealth(power);
        if (opponent.health === 0) {
          isFinished = true;
        }
        console.log(`Opponent remain on ${opponent.health} health.`);
        if (isCharacterOne) {
          duel.lastAttackCharacterOneAt = now;
        } else {
          duel.lastAttackCharacterTwoAt = now;
        }
        break;
      }

      case CombatAction.CAST: {
        if (
          lastCast &&
          !this.hasEnoughTimePassed(lastCast, now, CAST_AVAILABILITY)
        ) {
          throw new BadRequestException('Cast is not available now.');
        }
        const power = actor.getReadType().intelligence * 2;
        console.log(`Casting with power of ${power}`);

        opponent.removeHealth(power);
        if (opponent.health === 0) {
          isFinished = true;
        }
        console.log(`Opponent remain on ${opponent.health} health.`);

        if (isCharacterOne) {
          duel.lastCastCharacterOneAt = now;
        } else {
          duel.lastCastCharacterTwoAt = now;
        }
        break;
      }

      case CombatAction.HEAL: {
        if (
          lastHeal &&
          !this.hasEnoughTimePassed(lastHeal, now, HEAL_AVAILABILITY)
        ) {
          throw new BadRequestException('Heal is not available now.');
        }

        actor.heal();

        if (isCharacterOne) {
          duel.lastHealCharacterOneAt = now;
        } else {
          duel.lastHealCharacterTwoAt = now;
        }
        break;
      }
    }

    if (isFinished) {
      duel.status = DuelStatus.FINISHED;
    }

    return { isFinished };
  }
}
