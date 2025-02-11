
import * as path from 'path';
import { Message } from 'src/messages/entities/message.model';
import { PresetMessage } from 'src/messages/entities/preset-message.model';
import { DataSource } from 'typeorm';

export const TestDataSource = new DataSource({
	type: 'sqlite',
	//database: ':memory:',
	database: path.join(__dirname, 'test.db'),
	entities: [PresetMessage, Message],
	synchronize: true,
	migrations: ['./migrations/*.ts'],
});
