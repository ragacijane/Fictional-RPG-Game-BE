import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Class } from './class.entity';
import { CharacterItem } from './character-item.entity';
import { CharacterReadType } from '../dtos/character.dto';

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

  @Column({ type: 'boolean', default: false })
  inCombat: boolean;

  @ManyToOne(() => Class, { eager: true })
  @JoinColumn({ name: 'classId' })
  class: Class;

  @Column()
  classId: string;

  @OneToMany(() => CharacterItem, (ci) => ci.character, { eager: true })
  items: CharacterItem[];

  @Column()
  ownerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public heal() {
    this.health += this.getReadType().faith;
  }

  public removeHealth(value: number) {
    if (value > this.health) {
      this.health = 0;
    } else {
      this.health -= value;
    }
  }

  public getReadType(): CharacterReadType {
    let strength = this.baseStrength;
    let agility = this.baseAgility;
    let intelligence = this.baseIntelligence;
    let faith = this.baseFaith;

    const items = this.items.map((charItem) => {
      strength += charItem.item.bonusStrength * charItem.quantity;
      agility += charItem.item.bonusAgility * charItem.quantity;
      intelligence += charItem.item.bonusIntelligence * charItem.quantity;
      faith += charItem.item.bonusFaith * charItem.quantity;
      return charItem.item.getReadType();
    });

    return {
      id: this.id,
      name: this.name,
      health: this.health,
      mana: this.mana,
      strength,
      agility,
      intelligence,
      faith,
      inCombat: this.inCombat,
      className: this.class.name,
      items,
    };
  }
}
