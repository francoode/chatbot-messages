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
import { Chat } from 'src/chats/entities/chat.model';
import { SourceMessage } from 'src/types/chat.types';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false })
  source: SourceMessage;

  @Column({ nullable: false })
  internalId: string;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  @ManyToOne(() => PresetMessage, { eager: true })
  presetMessage: PresetMessage;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
