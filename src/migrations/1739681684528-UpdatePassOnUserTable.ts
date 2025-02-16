import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePassOnUserTable1739681684528 implements MigrationInterface {
  name = 'UpdatePassOnUserTable1739681684528';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "password" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
  }
}
