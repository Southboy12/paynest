-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('super_admin', 'hr_admin', 'payroll_officer', 'hr_officer', 'viewer');

-- Convert the free-text role column to the enum without losing data.
-- Existing values ('super_admin', 'hr_admin') are valid enum members; any
-- unexpected legacy value is normalized to the least-privileged role first
-- so the cast below cannot fail.
UPDATE "User"
SET "role" = 'viewer'
WHERE "role" NOT IN ('super_admin', 'hr_admin', 'payroll_officer', 'hr_officer', 'viewer');

ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;

ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole" USING ("role"::text::"UserRole");

ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'hr_admin';
