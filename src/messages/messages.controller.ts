
import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
	Param,
	Post,
	Req,
	Sse,
	UseInterceptors,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { AddMessageDto, MessageSerializer } from './dtos/message.dto';
import { MessagesService } from './messages.service';
import { PresetMessageSerializer } from './dtos/preset-message.dto';
import { MessagePattern } from '@nestjs/microservices';

//todo
export interface ChatBot {
	id: number;
	internalId: string;
	userId: number;
	createdAt: Date;
	updatedAt: Date;
	messages: any[];
}
@UseInterceptors(ClassSerializerInterceptor)
@Controller('messages')
export class MessagesController {
	constructor(private readonly messagesService: MessagesService) {}

	@Post()
	async add(@Body() body: AddMessageDto) {
		return await this.messagesService.addMessagesToChat(body);
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

	@MessagePattern('CHAT_CREATE_EVENT')
	async chatCreate(data: ChatBot) {
		await this.messagesService.addMessagesToChat({
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
