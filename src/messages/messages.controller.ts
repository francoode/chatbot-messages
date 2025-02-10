import { CHAT_CREATE_EVENT, ChatBot, MessagePattern } from '@chatbot/shared-lib';
import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, Req, Sse, UseInterceptors } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { AddMessageDto, MessageSerializer } from './dtos/message.dto';
import { MessagesService } from './messages.service';
import { PresetMessageSerializer } from './dtos/preset-message.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('messages')
export class MessagesController {
	constructor(private readonly messagesService: MessagesService) {}

	@Post()
	async add(@Body() body: AddMessageDto) {
		return true;
		await this.messagesService.addMessageToChat(body);
	}

	@Get('presets/:id')
	async getPreset(@Param('id') id: number): Promise<PresetMessageSerializer> {
		const preset = await this.messagesService.getPreset(id);
		return new PresetMessageSerializer(preset);
	}

	@Get('/chats/:chatId')
	async getChatMessages(@Param('chatId') id: number, @Req() req): Promise<MessageSerializer[]> {
		const messages = await this.messagesService.getChatMessages(id);
		return messages;
	}


	@MessagePattern(CHAT_CREATE_EVENT)
	async chatCreate(data: ChatBot) {
		await this.messagesService.addMessageToChat({
			chatId: data.id,
			optionSelectedId: 0,
			presetMessageId: 0,
			isRoot: true,
		});
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
