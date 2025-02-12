import { Message } from 'src/messages/entities/message.model';
import { SourceMessage } from 'src/messages/types/messages.types';
import { CreatorParams, MessageCreator } from './message.factory';
import { v4 as uuid } from 'uuid';

export class LeaveMessageCreator implements MessageCreator {
	constructor(private params: CreatorParams) {}

	create = async (): Promise<Message[]> => {
		const { body, messageRepository, presetRepository } = this.params;
		const { text, chatId } = body;

		const userMessage = messageRepository.getRepository().create({
			chatId,
			text,
			source: SourceMessage.CLIENT,
			internalId: uuid(),
		});

		const serverResponseMessage = messageRepository.getRepository().create({
			chatId,
			text: 'Esto es una respuesta del servidor !',
			source: SourceMessage.SERVER,
			internalId: uuid(),
		});

		const msgs = await messageRepository
			.getRepository()
			.save([userMessage, serverResponseMessage]);
		return msgs;
	};
}
