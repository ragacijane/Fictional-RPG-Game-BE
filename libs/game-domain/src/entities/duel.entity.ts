import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Character } from './character.entity';

@Entity('duels')
export class Duel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Character 1

  @ManyToOne(() => Character, { eager: true })
  @JoinColumn({ name: 'character_one_id' })
  characterOne: Character;

  @Column({ name: 'character_one_id', type: 'uuid' })
  characterOneId: string;

  @Column({ type: 'timestamptz', nullable: true })
  lastAttackCharacterOneAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  lastCastCharacterOneAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  lastHealCharacterOneAt: Date | null;

  // Character 2

  @ManyToOne(() => Character, { eager: true })
  @JoinColumn({ name: 'character_two_id' })
  characterTwo: Character;

  @Column({ name: 'character_two_id', type: 'uuid' })
  characterTwoId: string;
  @Column({ type: 'timestamptz', nullable: true })
  lastAttackCharacterTwoAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  lastCastCharacterTwoAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  lastHealCharacterTwoAt: Date | null;

  @Column({ type: 'timestamptz', nullable: false })
  maxDuelDuration: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
