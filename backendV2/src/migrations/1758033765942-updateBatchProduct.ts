import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBatchProduct1758033765942 implements MigrationInterface {
    name = 'UpdateBatchProduct1758033765942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ai_consultation" ADD "severity_level" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "ai_consultation" ADD "recommended_name_products" text`);
        await queryRunner.query(`ALTER TABLE "ai_consultation" ADD "treatment_duration" integer`);
        await queryRunner.query(`ALTER TABLE "ai_consultation" ADD "prevention_tips" text`);
        await queryRunner.query(`ALTER TABLE "ai_consultation" ADD "monitoring_signs" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ai_consultation" DROP COLUMN "monitoring_signs"`);
        await queryRunner.query(`ALTER TABLE "ai_consultation" DROP COLUMN "prevention_tips"`);
        await queryRunner.query(`ALTER TABLE "ai_consultation" DROP COLUMN "treatment_duration"`);
        await queryRunner.query(`ALTER TABLE "ai_consultation" DROP COLUMN "recommended_name_products"`);
        await queryRunner.query(`ALTER TABLE "ai_consultation" DROP COLUMN "severity_level"`);
    }

}
