import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PresetMessage } from '../entities/preset-message.model';

@Injectable()
export class PresetMessageRepository {
	@InjectRepository(PresetMessage)
	private repository: Repository<PresetMessage>;

    getRepository = () => this.repository;
}
