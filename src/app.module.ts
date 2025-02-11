import { Module } from '@nestjs/common';
import { MessagesModule } from './messages/messages.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './messages/entities/message.model';
import { PresetMessage } from './messages/entities/preset-message.model';
import { MessageDataSource } from '../data-source';

@Module({
	imports: [MessagesModule, TypeOrmModule.forRoot(MessageDataSource.options)],
	controllers: [],
	providers: [],
})
export class AppModule {}
