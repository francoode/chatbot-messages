import { Inject, Injectable, Logger } from '@nestjs/common';
import { Message } from '../entities/message.model';
import { AddMessageDto } from '../dtos/message.dto';
import { Repository } from 'typeorm/repository/Repository';
import {
	PresetMessage,
	PresetMessageTree,
} from '../entities/preset-message.model';
import { SourceMessage } from '../types/messages.types';
import { v4 as uuid } from 'uuid';

@Injectable()
export class MessageFactory {
	@Inject() presetRepository: Repository<PresetMessage>;
	@Inject() messageRepository: Repository<Message>;
	private readonly logger = new Logger(MessageFactory.name);

	getCreator = (body: AddMessageDto): MessageCreator => {
		try {
			switch (this.getType(body)) {
				case 'ROOT':
					return new RootMessageCreator(
						body,
						this.presetRepository,
						this.messageRepository,
					);
				case 'TERMINAL':
					throw new Error('terminal type - not implemented');
				case 'LEAVE':
					return new LeaveMessageCreator(
						body,
						this.presetRepository,
						this.messageRepository,
					);
				default:
					throw new Error('Invalid type');
			}
		} catch (e) {
			this.logger.error(`Error to create message - ${e}`);
		}
	};

	private getType = (body: AddMessageDto) => {
		const { isRoot, isTerminal } = body;
		if (isRoot) return 'ROOT';
		if (isTerminal) return 'TERMINAL';
		return 'LEAVE';
	};
}

interface MessageCreator {
	create(): Promise<Message[]>;
}

export class RootMessageCreator implements MessageCreator {
	constructor(
		private body: AddMessageDto,
		private presetRepository: Repository<PresetMessage>,
		private messageRepository: Repository<Message>,
	) {}

	create = async (): Promise<Message[]> => {
		const { chatId } = this.body;
		const presetMessage = await this.presetRepository.findOneByOrFail({
			type: PresetMessageTree.ROOT,
		});
		const message = this.messageRepository.create({
			chatId,
			text: presetMessage.text,
			source: SourceMessage.SERVER,
			internalId: uuid(),
		});
		const m = await this.messageRepository.save(message);
		return [m];
	};
}

export class LeaveMessageCreator implements MessageCreator {
	constructor(
		private body: AddMessageDto,
		private presetRepository: Repository<PresetMessage>,
		private messageRepository: Repository<Message>,
	) {}

	create = async (): Promise<Message[]> => {
		const { text, chatId } = this.body;

		const userMessage = this.messageRepository.create({
			chatId,
			text,
			source: SourceMessage.CLIENT,
			internalId: uuid(),
		});

		const serverResponseMessage = this.messageRepository.create({
			chatId,
			text: 'Esto es una respuesta del servidor !',
			source: SourceMessage.SERVER,
			internalId: uuid(),
		});

		const msgs = await this.messageRepository.save([
			userMessage,
			serverResponseMessage,
		]);
		return msgs;
	};
}
