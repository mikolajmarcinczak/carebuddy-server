-- CreateTable
CREATE TABLE "alarm" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "trigger_time" TIMESTAMP(6) NOT NULL,
    "message" STRING,

    CONSTRAINT "alarm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authorizationofcare" (
    "elderly_id" UUID NOT NULL,
    "caregiver_id" UUID NOT NULL,
    "document_url" STRING(2083),

    CONSTRAINT "authorizationofcare_pkey" PRIMARY KEY ("elderly_id","caregiver_id")
);

-- CreateTable
CREATE TABLE "caregiveraccountinfo" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "phone_number" STRING(15) NOT NULL,
    "city" STRING(50) NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "about_me" STRING,
    "rating" FLOAT8,
    "vote_count" INT8,

    CONSTRAINT "caregiveraccountinfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elderlyaccountinfo" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "phone_number" STRING(15) NOT NULL,
    "address" STRING NOT NULL,
    "city" STRING(50) NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "about_me" STRING,
    "height" FLOAT8 NOT NULL,
    "weight" FLOAT8 NOT NULL,
    "emergency_number" STRING(15) NOT NULL,

    CONSTRAINT "elderlyaccountinfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_ids" UUID[],
    "time" TIMESTAMP(6) NOT NULL,
    "location" STRING(255),
    "description" STRING,
    "title" STRING(255) NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledgebasearticle" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "title" STRING(100) NOT NULL,
    "content" STRING NOT NULL,
    "tags" STRING(255)[],
    "url" STRING(2083),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledgebasearticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicaltreatmententity" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "medicament_ids" UUID[],
    "diagnosis_date" DATE NOT NULL,
    "diagnosis" STRING NOT NULL,
    "treatment_plan" STRING NOT NULL,
    "certificate_url" STRING(2083),
    "prescription_url" STRING(2083),

    CONSTRAINT "medicaltreatmententity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicamententity" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING(255) NOT NULL,
    "dosage" STRING(255) NOT NULL,
    "manufacturer" STRING(255),
    "active_substance" STRING(255) NOT NULL,
    "composition" STRING,
    "contraindications" STRING,
    "indications" STRING,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medicamententity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "noteentity" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "related_user_ids" UUID[],
    "related_urls" STRING(2083)[],
    "title" STRING(100) NOT NULL,
    "content" STRING NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "noteentity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" STRING(50) NOT NULL,
    "password" STRING(50) NOT NULL,
    "role" STRING(50) NOT NULL,
    "email" STRING(100) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "caregiveraccountinfo_user_id_key" ON "caregiveraccountinfo"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "elderlyaccountinfo_user_id_key" ON "elderlyaccountinfo"("user_id");

-- AddForeignKey
ALTER TABLE "alarm" ADD CONSTRAINT "alarm_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "authorizationofcare" ADD CONSTRAINT "authorizationofcare_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "caregiveraccountinfo"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "authorizationofcare" ADD CONSTRAINT "authorizationofcare_elderly_id_fkey" FOREIGN KEY ("elderly_id") REFERENCES "elderlyaccountinfo"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "caregiveraccountinfo" ADD CONSTRAINT "caregiveraccountinfo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "elderlyaccountinfo" ADD CONSTRAINT "elderlyaccountinfo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "knowledgebasearticle" ADD CONSTRAINT "knowledgebasearticle_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "medicaltreatmententity" ADD CONSTRAINT "medicaltreatmententity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "noteentity" ADD CONSTRAINT "noteentity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
