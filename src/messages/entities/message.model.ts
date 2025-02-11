import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { PresetMessage } from './preset-message.model';
import { SourceMessage } from '../types/messages.types';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  source: SourceMessage;

  @Column({ nullable: false })
  internalId: string;

  @Column({ nullable: false })
  chatId: number;

  @Column({ nullable: false})
  text: string;

/*   @ManyToOne(() => PresetMessage, { eager: true })
  presetMessage: PresetMessage; */

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
