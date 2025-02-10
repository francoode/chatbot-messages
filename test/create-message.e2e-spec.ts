import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestDataSource } from '../data-source';
import { AppModule } from 'src/app.module';
import request from 'supertest';
import { getConnection } from 'typeorm';

describe('POST /messages', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				AppModule,
				TypeOrmModule.forRootAsync({
					useFactory: async () => {
						await TestDataSource.initialize(); // Inicializar DataSource manualmente
						return TestDataSource.options;
					},
				}),
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
		await getConnection().runMigrations();
	});

	it('/users (POST) - Crear usuario', async () => {
		const response = await request(app.getHttpServer())
			.post('/users')
			.send({ name: 'John Doe', email: 'john@example.com' })
			.expect(201);

		expect(response.body).toHaveProperty('id');
	});

	afterAll(async () => {
		await getConnection().close(); // Cerrar conexión de TypeORM
	});
});
