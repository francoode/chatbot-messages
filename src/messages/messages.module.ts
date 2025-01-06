import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.model';
import { PresetMessage } from './entities/preset-message.model';
import { PresetMessageOption } from './entities/preset-options.model';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [TypeOrmModule.forFeature([Message, PresetMessage, PresetMessageOption])],
  exports: [TypeOrmModule, MessagesService]
})
export class MessagesModule {}
