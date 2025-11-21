import { MigrationInterface, QueryRunner } from "typeorm";

export class InitCombatServiceDB1763729787986 implements MigrationInterface {
    name = 'InitCombatServiceDB1763729787986'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "duels" DROP CONSTRAINT "UQ_a1587a65a7f5d55bd7efd7e1cd2"`);
        await queryRunner.query(`ALTER TABLE "duels" DROP COLUMN "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "duels" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "duels" ADD CONSTRAINT "UQ_a1587a65a7f5d55bd7efd7e1cd2" UNIQUE ("name")`);
    }

}
