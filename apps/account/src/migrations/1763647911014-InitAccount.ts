import { MigrationInterface, QueryRunner } from "typeorm";

export class InitAccount1763647911014 implements MigrationInterface {
    name = 'InitAccount1763647911014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."accounts_role_enum" AS ENUM('User', 'GameMaster')`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "role" "public"."accounts_role_enum" NOT NULL DEFAULT 'User'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."accounts_role_enum"`);
    }

}
