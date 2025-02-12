import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../entities/message.model';
import { Repository } from 'typeorm';

@Injectable()
export class MessageReposity {
    @InjectRepository(Message) private repository: Repository<Message>;

    getRepository = () => this.repository;
}