import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { PresetMessageOption } from './preset-options.model';
import { Message } from './message.model';

export enum PresetMessageTree {
  ROOT = 'ROOT', //raiz
  TERMINAL = 'TERMINAL', //nodo terminal
  LEAVES = 'LEAVES', //hojas
}

@Entity()
export class PresetMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  text: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: PresetMessageTree,
    default: PresetMessageTree.LEAVES,
  })
  type: PresetMessageTree;

  @ManyToOne(() => PresetMessage, (mensaje) => mensaje.id)
  parentMessage: PresetMessage;

  @OneToMany(() => Message, (message) => message.presetMessage)
  messages: Message[];

  @OneToMany(() => PresetMessageOption, (option) => option.optionMessage, {
    cascade: true, // Propaga operaciones de persistencia
  })
  options: PresetMessageOption[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
