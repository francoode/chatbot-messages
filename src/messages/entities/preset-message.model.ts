import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Message } from './message.model';

export enum PresetMessageTree {
	ROOT = 'ROOT', //raiz
	TERMINAL = 'TERMINAL', //nodo terminal
	LEAVES = 'LEAVES', //respuesta
	OPTION = 'OPTION',
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

	//Mensaje anterior
	@ManyToOne(() => PresetMessage, (mensaje) => mensaje.id)
	parentMessage: PresetMessage;

	//Opciones dentro del mensaje.
/* 	@ManyToOne(() => PresetMessage, (message) => message.options)
	optionOf: PresetMessage;
	@OneToMany(() => PresetMessage, (message) => message.optionOf)
	options: PresetMessage[]; */

	//Respuesta a opcion
/* 	@OneToOne(() => PresetMessage)
	@JoinColumn()
	responseOf: PresetMessage;

	@OneToOne(() => PresetMessage, (message) => message.responseOf)
	answerMessage: PresetMessage; */

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
