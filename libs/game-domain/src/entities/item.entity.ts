import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ItemReadType } from '../dtos/item.dto';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  bonusStrength: number;

  @Column({ type: 'int', default: 0 })
  bonusAgility: number;

  @Column({ type: 'int', default: 0 })
  bonusIntelligence: number;

  @Column({ type: 'int', default: 0 })
  bonusFaith: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public getReadType(): ItemReadType {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      bonusStrength: this.bonusStrength,
      bonusAgility: this.bonusAgility,
      bonusIntelligence: this.bonusIntelligence,
      bonusFaith: this.bonusFaith,
    };
  }
}
