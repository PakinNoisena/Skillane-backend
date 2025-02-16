import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1739681070981 implements MigrationInterface {
  name = 'CreateUsersTable1739681070981';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "identificationNo" character varying NOT NULL, "dob" TIMESTAMP NOT NULL, "phoneNo" integer NOT NULL, "profileImg" character varying NOT NULL, "googleId" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
