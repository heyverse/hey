-- CreateTable
CREATE TABLE "public"."AppRequest" (
    "accountAddress" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppRequest_pkey" PRIMARY KEY ("accountAddress")
);
