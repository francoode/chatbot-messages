import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, Sse, UseInterceptors } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AddMessage } from 'src/types/chat.types';
import { CHAT_CREATE_EVENT } from '@chatbot/shared-lib';
import { MessagePattern } from '@nestjs/microservices';
import { Chat } from 'src/chats/entities/chat.model';
import { Observable, map } from 'rxjs';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async add(@Body() body: AddMessage) {
    await this.messagesService.addMessageToChat(body);
  }

  @Get('presets/:id')
  async getPreset(@Param('id') id: number) {
    return await this.messagesService.getPreset(id);
  }


  ///Implementar SAGA
  @MessagePattern(CHAT_CREATE_EVENT)
  async chatCreate(data: Chat) {
    await this.messagesService.createRootMessage(data);
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
