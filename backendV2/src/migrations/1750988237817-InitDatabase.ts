import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1750988237817 implements MigrationInterface {
    name = 'InitDatabase1750988237817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "promotion" DROP CONSTRAINT "FK_6379db9665cd107c9b9efcb9831"`);
        await queryRunner.query(`ALTER TABLE "promotion" DROP COLUMN "discount_type_id"`);
        await queryRunner.query(`ALTER TABLE "store_owner_request" ADD "name" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_owner_request" ADD "business_license" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_owner_request" ADD "invenstory_address" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_owner_request" ADD "invenstory_lat" numeric(9,6)`);
        await queryRunner.query(`ALTER TABLE "store_owner_request" ADD "invenstory_lng" numeric(9,6)`);
        await queryRunner.query(`ALTER TABLE "store_owner_request" ADD "invenstory_img" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "user" ADD "cccd" character varying(12)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "cccd"`);
        await queryRunner.query(`ALTER TABLE "store_owner_request" DROP COLUMN "invenstory_img"`);
        await queryRunner.query(`ALTER TABLE "store_owner_request" DROP COLUMN "invenstory_lng"`);
        await queryRunner.query(`ALTER TABLE "store_owner_request" DROP COLUMN "invenstory_lat"`);
        await queryRunner.query(`ALTER TABLE "store_owner_request" DROP COLUMN "invenstory_address"`);
        await queryRunner.query(`ALTER TABLE "store_owner_request" DROP COLUMN "business_license"`);
        await queryRunner.query(`ALTER TABLE "store_owner_request" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "promotion" ADD "discount_type_id" uuid`);
        await queryRunner.query(`ALTER TABLE "promotion" ADD CONSTRAINT "FK_6379db9665cd107c9b9efcb9831" FOREIGN KEY ("discount_type_id") REFERENCES "discount_type"("discount_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
