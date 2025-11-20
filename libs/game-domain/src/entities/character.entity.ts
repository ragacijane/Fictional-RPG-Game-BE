import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Class } from './class.entity';
import { Item } from './item.entity';
import { CharacterItem } from './character-item.entity';

@Entity('characters')
export class Character {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'int', default: 100 })
  health: number;

  @Column({ type: 'int', default: 50 })
  mana: number;

  @Column({ type: 'int', default: 5 })
  baseStrength: number;

  @Column({ type: 'int', default: 5 })
  baseAgility: number;

  @Column({ type: 'int', default: 5 })
  baseIntelligence: number;

  @Column({ type: 'int', default: 5 })
  baseFaith: number;

  @ManyToOne(() => Class, { eager: true })
  @JoinColumn({ name: 'classId' })
  class: Class;

  @Column()
  classId: string;

  @OneToMany(() => CharacterItem, (ci) => ci.character, { eager: true })
  items: CharacterItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
