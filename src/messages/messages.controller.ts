import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
	Param,
	Post,
	Sse,
	UseInterceptors,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Observable, map } from 'rxjs';
import { CHAT_CREATE_EVENT, ChatBot, MessagePattern } from '@chatbot/shared-lib';
import { AddMessageDto } from './dtos/message.dto';

@Controller('messages')
export class MessagesController {
	constructor(private readonly messagesService: MessagesService) {}

	@Post()
	async add(@Body() body: AddMessageDto) {
		await this.messagesService.addMessageToChat(body);
	}

	@Get('presets/:id')
	async getPreset(@Param('id') id: number) {
		return await this.messagesService.getPreset(id);
	}

	///Implementar SAGA
	@MessagePattern(CHAT_CREATE_EVENT)
	async chatCreate(data: ChatBot) {
    const rootData: AddMessageDto = {
      chatId: data.id,
			optionSelectedId: 0,
			presetMessageId: 0,
      isRoot: true
    }

		await this.messagesService.addMessageToChat(rootData);
	}

	@Sse()
	sendEvents(): Observable<MessageEvent> {
		return this.messagesService.getDataStream().pipe(
			map((message) => {
				const event: MessageEvent = new MessageEvent('data', {
					data: {
						message,
					},
				});
				return event;
			}),
		);
	}
}
