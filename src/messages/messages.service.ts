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

	private dataSubject = new Subject<any>();

	getDataStream = () => this.dataSubject.asObservable();

	getPreset = async (id: number) => {
		return this.presetRepository.findOneOrFail({ where: { id } });
	};

	addMessageToChat = async (body: AddMessageDto) => {
		const { chatId, optionSelectedId, presetMessageId, isRoot, isTerminal } = body;

		if (isRoot || isTerminal) {
			const message = await this.addSpecialMessage(body);
			this.dataSubject.next({ message });
			return;
		}

		const presetMessage = await this.presetRepository.findOneOrFail({
			where: { id: presetMessageId },
			relations: ['options'],
		});

		checkOption(presetMessage, optionSelectedId);
		const preset = await this.presetRepository.findOneByOrFail({ id: optionSelectedId });
		this.dataSubject.next({ message: preset });
	};

	private addSpecialMessage = async (body: AddMessageDto) => {
		const { chatId, isRoot } = body;

		const presetMessage = await this.presetRepository.findOneByOrFail({
			type: isRoot ? PresetMessageTree.ROOT : PresetMessageTree.TERMINAL,
		});

		const newMessage = this.messageRepository.create({
			chatId: chatId,
			presetMessage,
			source: SourceMessage.SERVER,
			internalId: uuid(),
		});

		return this.messageRepository.save(newMessage);
	};
}

