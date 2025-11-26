import { MigrationInterface, QueryRunner } from "typeorm";

export class InitCombatServiceDB1764148226365 implements MigrationInterface {
    name = 'InitCombatServiceDB1764148226365'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."classes_name_enum" AS ENUM('Warrior', 'Rogue', 'Mage')`);
        await queryRunner.query(`CREATE TABLE "classes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" "public"."classes_name_enum" NOT NULL DEFAULT 'Warrior', "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e207aa15404e9b2ce35910f9f7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "bonusStrength" integer NOT NULL DEFAULT '0', "bonusAgility" integer NOT NULL DEFAULT '0', "bonusIntelligence" integer NOT NULL DEFAULT '0', "bonusFaith" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "character_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "characterId" uuid NOT NULL, "itemId" uuid NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_44b7c460c7a4cf041347f0feea1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "characters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "health" integer NOT NULL DEFAULT '100', "mana" integer NOT NULL DEFAULT '50', "baseStrength" integer NOT NULL DEFAULT '5', "baseAgility" integer NOT NULL DEFAULT '5', "baseIntelligence" integer NOT NULL DEFAULT '5', "baseFaith" integer NOT NULL DEFAULT '5', "inCombat" boolean NOT NULL DEFAULT false, "classId" uuid NOT NULL, "ownerId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_86a2bcc85e3473ecf3693dfe5a1" UNIQUE ("name"), CONSTRAINT "PK_9d731e05758f26b9315dac5e378" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."duels_status_enum" AS ENUM('Active', 'Finished')`);
        await queryRunner.query(`CREATE TABLE "duels" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."duels_status_enum" NOT NULL DEFAULT 'Active', "maxDuelDuration" TIMESTAMP WITH TIME ZONE NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "character_one_id" uuid NOT NULL, "lastAttackCharacterOneAt" TIMESTAMP WITH TIME ZONE, "lastCastCharacterOneAt" TIMESTAMP WITH TIME ZONE, "lastHealCharacterOneAt" TIMESTAMP WITH TIME ZONE, "character_two_id" uuid NOT NULL, "lastAttackCharacterTwoAt" TIMESTAMP WITH TIME ZONE, "lastCastCharacterTwoAt" TIMESTAMP WITH TIME ZONE, "lastHealCharacterTwoAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_138743a525868817b14d09a0d3e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "character_items" ADD CONSTRAINT "FK_9c49e8d7aa1d60b580a2bee26e6" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "character_items" ADD CONSTRAINT "FK_f511d56ae925dae63faba6c08fd" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "characters" ADD CONSTRAINT "FK_a4225a8dfb349ac0b4576aabe88" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "duels" ADD CONSTRAINT "FK_833320d4eb48284e0bdb6628810" FOREIGN KEY ("character_one_id") REFERENCES "characters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "duels" ADD CONSTRAINT "FK_b7de16c66f28e8f4efa183eb8fc" FOREIGN KEY ("character_two_id") REFERENCES "characters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "duels" DROP CONSTRAINT "FK_b7de16c66f28e8f4efa183eb8fc"`);
        await queryRunner.query(`ALTER TABLE "duels" DROP CONSTRAINT "FK_833320d4eb48284e0bdb6628810"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP CONSTRAINT "FK_a4225a8dfb349ac0b4576aabe88"`);
        await queryRunner.query(`ALTER TABLE "character_items" DROP CONSTRAINT "FK_f511d56ae925dae63faba6c08fd"`);
        await queryRunner.query(`ALTER TABLE "character_items" DROP CONSTRAINT "FK_9c49e8d7aa1d60b580a2bee26e6"`);
        await queryRunner.query(`DROP TABLE "duels"`);
        await queryRunner.query(`DROP TYPE "public"."duels_status_enum"`);
        await queryRunner.query(`DROP TABLE "characters"`);
        await queryRunner.query(`DROP TABLE "character_items"`);
        await queryRunner.query(`DROP TABLE "items"`);
        await queryRunner.query(`DROP TABLE "classes"`);
        await queryRunner.query(`DROP TYPE "public"."classes_name_enum"`);
    }

}
