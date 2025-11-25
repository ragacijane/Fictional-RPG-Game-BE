import { MigrationInterface, QueryRunner } from "typeorm";

export class InitCombatServiceDB1764065861000 implements MigrationInterface {
    name = 'InitCombatServiceDB1764065861000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "character_items" DROP CONSTRAINT "FK_9c49e8d7aa1d60b580a2bee26e6"`);
        await queryRunner.query(`ALTER TABLE "character_items" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "duels" ADD "maxDuelDuration" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "character_items" ADD CONSTRAINT "FK_9c49e8d7aa1d60b580a2bee26e6" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "character_items" DROP CONSTRAINT "FK_9c49e8d7aa1d60b580a2bee26e6"`);
        await queryRunner.query(`ALTER TABLE "duels" DROP COLUMN "maxDuelDuration"`);
        await queryRunner.query(`ALTER TABLE "character_items" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "character_items" ADD CONSTRAINT "FK_9c49e8d7aa1d60b580a2bee26e6" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
