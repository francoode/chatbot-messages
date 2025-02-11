import { PresetMessage, PresetMessageTree } from '../src/messages/entities/preset-message.model';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1739230717601 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const pmRepo = queryRunner.manager.getRepository(PresetMessage);
		await pmRepo.insert([
			{
				text: 'Hola !',
				type: PresetMessageTree.ROOT,
			},
			{
				text: 'Chau, hasta la proxima !',
				type: PresetMessageTree.TERMINAL,
			},
			{
				text: 'Esto es una hoja',
				type: PresetMessageTree.LEAVES,
			},
		]);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
        const pmRepo = queryRunner.manager.getRepository(PresetMessage);
        await pmRepo.delete({});
    }
}
