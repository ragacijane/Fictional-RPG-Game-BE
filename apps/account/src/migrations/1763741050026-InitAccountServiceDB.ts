import { MigrationInterface, QueryRunner } from "typeorm";

export class InitAccountServiceDB1763741050026 implements MigrationInterface {
    name = 'InitAccountServiceDB1763741050026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" RENAME COLUMN "passwordHash" TO "password"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" RENAME COLUMN "password" TO "passwordHash"`);
    }

}
