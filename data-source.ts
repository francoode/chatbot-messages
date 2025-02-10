import { DataSource } from 'typeorm';

export const TestDataSource = new DataSource({
	type: 'sqlite',
	database: ':memory:',
	entities: ['src/**/*.entity{.ts,.js}'],
	synchronize: true,
	migrations: ['src/migrations/*.ts'],
});
