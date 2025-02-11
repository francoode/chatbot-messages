import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageDataSource } from '../data-source';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { AddMessageDto } from 'src/messages/dtos/message.dto';

describe('POST /messages', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const dataSource = MessageDataSource;
		if (!dataSource.isInitialized) {
			await dataSource.initialize();
		}

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

	afterAll(async () => {
		const dataSource = MessageDataSource;
		await app.close();
		await dataSource.dropDatabase();
	});

	it('/messages (POST) - Add message to chat', async () => {
		const body: AddMessageDto = {
			chatId: 1,
			optionSelectedId: 0,
			presetMessageId: 0,
			isRoot: true,
		};

		const response = await request(app.getHttpServer()).post('/messages').send(body).expect(201);

		expect(response.body).toHaveProperty('id');
	});

	it('Add root message automatic', async () => {
		const body: AddMessageDto = {
			chatId: 1,
			optionSelectedId: 0,
			presetMessageId: 0,
			isRoot: true,
		};

		const response = await request(app.getHttpServer()).post('/messages').send(body).expect(201);

		expect(response.body).toHaveProperty('id');
	});

	it('Add leave message', async () => {
		const body: AddMessageDto = {
			chatId: 1,
			text: 'Hola desde el cliente',
			isRoot: false,
		};

		const response = await request(app.getHttpServer()).post('/messages').send(body).expect(201);

		expect(response.body).toHaveProperty('id');
		expect(response.body.text).toEqual('Hola desde el cliente');
		
	});

	it('Add message to invalid chat', async () => {
		const body: AddMessageDto = {
			chatId: 5,
			optionSelectedId: 0,
			presetMessageId: 0,
			isRoot: true,
		};

		//aca deberia haber un error, ver como manejar
		await request(app.getHttpServer()).post('/messages').send(body).expect(201);
	});
});
