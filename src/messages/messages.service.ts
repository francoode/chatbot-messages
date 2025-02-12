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
import { MessageFactory } from './classes/message-factory/message.factory';
import { MessageReposity } from './classes/message.repository';
import { PresetMessageRepository } from './classes/preset-message.repository';

@Injectable()
export class MessagesService {
	@Inject() private messageRepository: MessageReposity;
	@Inject() private presetMessageRepository: PresetMessageRepository;

	@Inject() messageFactory: MessageFactory;

	private dataSubject = new Subject<Message>();
	getDataStream = () => this.dataSubject.asObservable();

	getChatMessages = async (id: number): Promise<MessageSerializer[]> => {
		const messages = [];
		return messages.map((m) => new MessageSerializer(m));
	};

	addMessagesToChat = async (body: AddMessageDto): Promise<Message[]> => {
		const factory = this.messageFactory.getCreator(body);
		return await factory.create();
		//this.dataSubject.next(message);
	};
}
