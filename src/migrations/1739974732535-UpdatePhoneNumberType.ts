import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePhoneNumberType1739974732535 implements MigrationInterface {
  name = 'UpdatePhoneNumberType1739974732535';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phoneNo"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "phoneNo" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phoneNo"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "phoneNo" integer`);
  }
}
