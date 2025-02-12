import { Message } from 'src/messages/entities/message.model';
import {
    PresetMessageTree
} from 'src/messages/entities/preset-message.model';
import { SourceMessage } from 'src/messages/types/messages.types';
import { CreatorParams, MessageCreator } from './message.factory';
import { v4 as uuid } from 'uuid';

export class RootMessageCreator implements MessageCreator {
	constructor(private params: CreatorParams) {}

	create = async (): Promise<Message[]> => {
		const { body, messageRepository, presetRepository } = this.params;

		const { chatId } = body;

		const presetMessage = await presetRepository
			.getRepository()
			.findOneByOrFail({
				type: PresetMessageTree.ROOT,
			});

		const message = messageRepository.getRepository().create({
			chatId,
			text: presetMessage.text,
			source: SourceMessage.SERVER,
			internalId: uuid(),
		});

		const m = await messageRepository.getRepository().save(message);
		return [m];
	};
}
