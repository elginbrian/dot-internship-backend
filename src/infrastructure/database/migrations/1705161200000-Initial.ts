import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1705161200000 implements MigrationInterface {
  name = 'Initial1705161200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "username" character varying NOT NULL,
        "password_hash" character varying NOT NULL,
        "role" character varying NOT NULL DEFAULT 'USER',
        "nip" character varying NOT NULL,
        "divisi" character varying NOT NULL,
        "no_hp" character varying NOT NULL,
        "cabang" character varying NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "UQ_users_nip" UNIQUE ("nip"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "laporan" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "jenis_laporan" character varying NOT NULL,
        "kategori" character varying NOT NULL,
        "instansi" character varying NOT NULL,
        "deskripsi" text NOT NULL,
        "total" integer NOT NULL,
        "foto_filename" character varying,
        "latitude" numeric(10,7),
        "longitude" numeric(10,7),
        "timestamp_foto" TIMESTAMP,
        "status" character varying NOT NULL DEFAULT 'pending',
        "remark" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_laporan_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_laporan_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_laporan_user_id" ON "laporan" ("user_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_laporan_status" ON "laporan" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_laporan_created_at" ON "laporan" ("created_at")
    `);

    // Password default: 'password123'
    await queryRunner.query(`
      INSERT INTO "users" (
        "email", "username", "password_hash", "role", "nip", "divisi", "no_hp", "cabang", "is_active"
      ) VALUES (
        'admin@gmail.com', 
        'Administrator Bank', 
        '$2b$10$nByNHT.Bvdf8O9A9.tO7z.v/Q6P6hE1y6S7O7hE1y6S7O7hE1y6S7', 
        'ADMIN', 
        'DEV00001', 
        'Unsecured Loan', 
        '081234567890', 
        'Malang Kawi', 
        true
      )
    `);

    // Password default: 'password123'
    await queryRunner.query(`
      INSERT INTO "users" (
        "email", "username", "password_hash", "role", "nip", "divisi", "no_hp", "cabang", "is_active"
      ) VALUES (
        'supervisor@gmail.com', 
        'Supervisor Bank', 
        '$2b$10$nByNHT.Bvdf8O9A9.tO7z.v/Q6P6hE1y6S7O7hE1y6S7O7hE1y6S7', 
        'SUPERVISOR', 
        'DEV00002', 
        'Unsecured Loan', 
        '081234567891', 
        'Malang Kawi', 
        true
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "users" WHERE "nip" IN ('DEV00001', 'DEV00002')`);
    await queryRunner.query(`DROP INDEX "IDX_laporan_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_laporan_status"`);
    await queryRunner.query(`DROP INDEX "IDX_laporan_user_id"`);
    await queryRunner.query(`DROP TABLE "laporan"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
