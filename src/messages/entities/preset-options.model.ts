import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { PresetMessage } from './preset-message.model';

@Entity()
export class PresetMessageOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @ManyToOne(() => PresetMessage, (message) => message.options, {
    onDelete: 'CASCADE', // Elimina opciones si se elimina el mensaje padre
  })
  optionMessage: PresetMessage;

  @OneToOne(() => PresetMessage)
  @JoinColumn()
  presetMessageDisplay: PresetMessage;
}
