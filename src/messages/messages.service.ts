import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from 'rxjs';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { AddMessageDto, MessageSerializer } from './dtos/message.dto';
import { Message } from './entities/message.model';
import {
	PresetMessage,
	PresetMessageTree,
} from './entities/preset-message.model';
import { SourceMessage } from './types/messages.types';
import { MessageFactory } from './classes/message.factory';

@Injectable()
export class MessagesService {
	@InjectRepository(PresetMessage)
	private presetRepository: Repository<PresetMessage>;
	@InjectRepository(Message) private messageRepository: Repository<Message>;
	private dataSubject = new Subject<Message>();

	@Inject() messageFactory: MessageFactory;

	getDataStream = () => this.dataSubject.asObservable();

	getPreset = async (id: number) => {
		return this.presetRepository.findOneOrFail({
			where: { id },
			relations: ['options', 'answerMessage'],
		});
	};

	getChatMessages = async (id: number): Promise<MessageSerializer[]> => {
		//@todo paginar y ordenar.
		const messages = await this.messageRepository.find({
			where: { chatId: id },
			//relations: ['presetMessage', 'presetMessage.options', 'presetMessage.answerMessage'],
		});

		return messages.map((m) => new MessageSerializer(m));
	};

	addMessagesToChat = async (body: AddMessageDto): Promise<Message[]> => {
		const factory = this.messageFactory.getCreator(body);
		return await factory.create();
		

		//this.dataSubject.next(message);
		
	};

	private addUserMessage = async (body: AddMessageDto) => {
		const { presetMessageId, optionSelectedId, chatId, text } = body;

		/* const presetMessage = await this.presetRepository.findOneOrFail({
			where: { id: presetMessageId },
			relations: ['options'],
		}); */

		//checkOption(presetMessage, optionSelectedId);
		//const responseMessage = await this.presetRepository.findOneByOrFail({ id: optionSelectedId });

		return await this.create({
			chatId,
			text: 'Mensaje de respuesta',
			//presetMessage: responseMessage,
		});
	};

	private addSpecialMessage = async (body: AddMessageDto) => {
		const { chatId, isRoot } = body;

		const presetMessage = await this.presetRepository.findOneByOrFail({
			type: isRoot ? PresetMessageTree.ROOT : PresetMessageTree.TERMINAL,
		});

		return this.create({
			chatId,
			presetMessage,
			source: SourceMessage.SERVER,
		});
	};

	private create = (data: {
		chatId: number;
		text?: string;
		presetMessage?: PresetMessage;
		source?: SourceMessage;
		internalId?: string;
	}) => {
		const { chatId, presetMessage, text, source, internalId } = data;

		const message = this.messageRepository.create({
			chatId,
			text: presetMessage ? presetMessage.text : text,
			source: source || SourceMessage.CLIENT,
			internalId: internalId || uuid(),
		});

		/* const message = this.messageRepository.create({
			chatId,
			presetMessage,
			source: source || SourceMessage.CLIENT,
			internalId: internalId || uuid(),
		}); */

		return this.messageRepository.save(message);
	};
}
