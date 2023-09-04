-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('Manager', 'Staff');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "RoleType" NOT NULL DEFAULT 'Staff';
