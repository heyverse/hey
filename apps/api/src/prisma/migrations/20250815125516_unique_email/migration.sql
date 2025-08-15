/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `AppRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AppRequest_email_key" ON "public"."AppRequest"("email");
