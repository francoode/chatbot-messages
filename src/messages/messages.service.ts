import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from 'rxjs';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { AddMessageDto } from './dtos/message.dto';
import { Message } from './entities/message.model';
import { PresetMessage, PresetMessageTree } from './entities/preset-message.model';
import { SourceMessage } from './types/messages.types';
import { checkOption } from './helpers/message.helper';

@Injectable()
export class MessagesService {
	@InjectRepository(PresetMessage) private presetRepository: Repository<PresetMessage>;
	@InjectRepository(Message) private messageRepository: Repository<Message>;
	private dataSubject = new Subject<Message>();

	getDataStream = () => this.dataSubject.asObservable();
	getPreset = async (id: number) => this.presetRepository.findOneOrFail({ where: { id } });

	addMessageToChat = async (body: AddMessageDto) => {
		const { isRoot, isTerminal } = body;

		const message =
			isRoot || isTerminal ? await this.addSpecialMessage(body) : await this.addUserMessage(body);

		this.dataSubject.next(message);
	};

	private addUserMessage = async (body: AddMessageDto) => {
		const { presetMessageId, optionSelectedId, chatId } = body;

		const presetMessage = await this.presetRepository.findOneOrFail({
			where: { id: presetMessageId },
			relations: ['options'],
		});

		checkOption(presetMessage, optionSelectedId);
		const responseMessage = await this.presetRepository.findOneByOrFail({ id: optionSelectedId });

		return await this.create({
			chatId,
			presetMessage: responseMessage,
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
		presetMessage: PresetMessage;
		source?: SourceMessage;
		internalId?: string;
	}) => {
		const { chatId, presetMessage, source, internalId } = data;

		const message = this.messageRepository.create({
			chatId,
			presetMessage,
			source: source || SourceMessage.CLIENT,
			internalId: internalId || uuid(),
		});

		return this.messageRepository.save(message);
	};
}
