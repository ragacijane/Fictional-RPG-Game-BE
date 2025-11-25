import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Character } from './character.entity';
import { Item } from './item.entity';

@Entity('character_items')
export class CharacterItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  characterId: string;

  @Column()
  itemId: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @ManyToOne(() => Character, (c) => c.items)
  @JoinColumn({ name: 'characterId' })
  character: Character;

  @ManyToOne(() => Item, { eager: true })
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  public incQuantity() {
    this.quantity += 1;
  }
}
