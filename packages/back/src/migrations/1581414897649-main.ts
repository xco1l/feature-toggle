import {MigrationInterface, QueryRunner} from 'typeorm';

export class main1581414897649 implements MigrationInterface {
  name = 'main1581414897649';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "state" boolean, "path" ltree NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL DEFAULT '', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "lastCall" TIMESTAMP, "type" "entity_type_enum" NOT NULL, "owner" character varying NOT NULL, "parentId" character varying, CONSTRAINT "PK_50a7741b415bc585fcf9c984332" PRIMARY KEY ("id"))`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "entity"`, undefined);
  }
}
