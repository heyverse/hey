/*
  Warnings:

  - You are about to drop the `AccountPermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AccountPermission" DROP CONSTRAINT "AccountPermission_permissionId_fkey";

-- DropTable
DROP TABLE "AccountPermission";

-- DropTable
DROP TABLE "Permission";

-- DropEnum
DROP TYPE "PermissionType";
