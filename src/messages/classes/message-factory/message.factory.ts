import { Inject, Injectable, Logger } from '@nestjs/common';
import { AddMessageDto } from '../../dtos/message.dto';
import { Message } from '../../entities/message.model';
import { MessageReposity } from '../message.repository';
import { PresetMessageRepository } from '../preset-message.repository';
import { LeaveMessageCreator } from './leave-message.creator';
import { RootMessageCreator } from './root-message.creator';

@Injectable()
export class MessageFactory {
	@Inject() presetRepository: PresetMessageRepository;
	@Inject() messageRepository: MessageReposity;
	private readonly logger = new Logger(MessageFactory.name);

	getCreator = (body: AddMessageDto): MessageCreator => {
		const params: CreatorParams =  {
			body,
			presetRepository: this.presetRepository,
			messageRepository: this.messageRepository
		}

		try {
			switch (this.getType(body)) {
				case 'ROOT':
					return new RootMessageCreator(params);
				case 'TERMINAL':
					throw new Error('terminal type - not implemented');
				case 'LEAVE':
					return new LeaveMessageCreator(params);
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

export interface MessageCreator {
	create(): Promise<Message[]>;
}

export type CreatorParams = {
	body: AddMessageDto;
	presetRepository: PresetMessageRepository;
	messageRepository: MessageReposity;
};




