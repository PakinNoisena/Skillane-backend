import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccountRecoveryTable1739681133591
  implements MigrationInterface
{
  name = 'CreateAccountRecoveryTable1739681133591';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "account_recoveries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "hasRecovered" boolean NOT NULL DEFAULT false, "expiresAt" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_4f09d2a72f551a9a6fba564640e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "identificationNo" character varying NOT NULL, "dob" TIMESTAMP NOT NULL, "phoneNo" integer NOT NULL, "profileImg" character varying NOT NULL, "googleId" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_recoveries" ADD CONSTRAINT "FK_dce482264ef4c6e2c729b5c6248" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account_recoveries" DROP CONSTRAINT "FK_dce482264ef4c6e2c729b5c6248"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "account_recoveries"`);
  }
}
