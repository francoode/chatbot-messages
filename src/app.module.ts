import { Module } from '@nestjs/common';
import { MessagesModule } from './messages/messages.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './messages/entities/message.model';
import { PresetMessage } from './messages/entities/preset-message.model';
import { TestDataSource } from '../data-source';

@Module({
	imports: [
		MessagesModule,
		/* TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: Number(3306),
      username: 'root',
      password: 'appmodule',
      database: 'chat_bot',
      entities: [Message, PresetMessage],
      synchronize: true,
    }) */
   TypeOrmModule.forRoot(TestDataSource.options),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
