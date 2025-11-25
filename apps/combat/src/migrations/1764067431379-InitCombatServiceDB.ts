import { MigrationInterface, QueryRunner } from "typeorm";

export class InitCombatServiceDB1764067431379 implements MigrationInterface {
    name = 'InitCombatServiceDB1764067431379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."duels_status_enum" AS ENUM('Active', 'Finished')`);
        await queryRunner.query(`ALTER TABLE "duels" ADD "status" "public"."duels_status_enum" NOT NULL DEFAULT 'Active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "duels" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."duels_status_enum"`);
    }

}
