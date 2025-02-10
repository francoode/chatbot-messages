import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestDataSource } from '../data-source';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { AddMessageDto } from 'src/messages/dtos/message.dto';

describe('POST /messages', () => {
	let app: INestApplication;

	beforeAll(async () => {

		const dataSource = TestDataSource;
		await dataSource.initialize();
		await dataSource.runMigrations();

		const moduleRef: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		})
		.overrideModule(TypeOrmModule)
		.useModule(TypeOrmModule.forRoot(dataSource.options))
		.compile();

		app = moduleRef.createNestApplication();
		await app.init();
		
		
	});

	it('/messages (POST) - Add message to chat', async () => {
		const body: AddMessageDto = {
			chatId: 1,
			optionSelectedId: 0,
			presetMessageId: 0,
			isRoot: true
		}

		const response = await request(app.getHttpServer())
			.post('/messages')
			.send(body)
			.expect(201);

		expect(response.body).toHaveProperty('id');
	});
});
