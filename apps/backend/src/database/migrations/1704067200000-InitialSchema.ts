import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1704067200000 implements MigrationInterface {
  name = 'InitialSchema1704067200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 建立 users 表
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM('SUPER_ADMIN', 'ADMIN', 'VIEWER');
      
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL UNIQUE,
        "password" character varying NOT NULL,
        "name" character varying NOT NULL,
        "role" "user_role_enum" NOT NULL DEFAULT 'ADMIN',
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // 建立 projects 表
    await queryRunner.query(`
      CREATE TYPE "project_status_enum" AS ENUM('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED');
      
      CREATE TABLE "projects" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" text,
        "status" "project_status_enum" NOT NULL DEFAULT 'DRAFT',
        "upload_token" character varying NOT NULL UNIQUE,
        "created_by" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "fk_projects_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION
      );
      
      CREATE INDEX "idx_projects_status" ON "projects" ("status");
      CREATE INDEX "idx_projects_upload_token" ON "projects" ("upload_token");
    `);

    // 建立 required_documents 表
    await queryRunner.query(`
      CREATE TABLE "required_documents" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "name" character varying NOT NULL,
        "description" text,
        "is_required" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "fk_required_documents_project" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE
      );
      
      CREATE INDEX "idx_required_documents_project" ON "required_documents" ("project_id");
    `);

    // 建立 uploads 表
    await queryRunner.query(`
      CREATE TYPE "upload_status_enum" AS ENUM('PENDING', 'UPLOADED', 'APPROVED', 'REJECTED');
      
      CREATE TABLE "uploads" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "required_document_id" uuid NOT NULL,
        "filename" character varying NOT NULL,
        "original_filename" character varying NOT NULL,
        "file_size" bigint NOT NULL,
        "mime_type" character varying NOT NULL,
        "status" "upload_status_enum" NOT NULL DEFAULT 'UPLOADED',
        "version" integer NOT NULL DEFAULT 1,
        "storage_path" character varying NOT NULL,
        "uploader_ip" character varying,
        "uploader_company" character varying,
        "uploader_email" character varying,
        "uploader_name" character varying,
        "uploaded_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "fk_uploads_required_document" FOREIGN KEY ("required_document_id") REFERENCES "required_documents"("id") ON DELETE NO ACTION
      );
      
      CREATE INDEX "idx_uploads_required_document" ON "uploads" ("required_document_id");
      CREATE INDEX "idx_uploads_status" ON "uploads" ("status");
    `);

    // 建立 reviews 表
    await queryRunner.query(`
      CREATE TABLE "reviews" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "upload_id" uuid NOT NULL,
        "reviewer_id" uuid NOT NULL,
        "status" "upload_status_enum" NOT NULL,
        "comment" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "fk_reviews_upload" FOREIGN KEY ("upload_id") REFERENCES "uploads"("id") ON DELETE NO ACTION,
        CONSTRAINT "fk_reviews_reviewer" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE NO ACTION
      );
      
      CREATE INDEX "idx_reviews_upload" ON "reviews" ("upload_id");
      CREATE INDEX "idx_reviews_reviewer" ON "reviews" ("reviewer_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 刪除資料表（反向順序）
    await queryRunner.query(`DROP TABLE "reviews"`);
    await queryRunner.query(`DROP TABLE "uploads"`);
    await queryRunner.query(`DROP TABLE "required_documents"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TABLE "users"`);

    // 刪除 ENUM 類型
    await queryRunner.query(`DROP TYPE "upload_status_enum"`);
    await queryRunner.query(`DROP TYPE "project_status_enum"`);
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
  }
}

