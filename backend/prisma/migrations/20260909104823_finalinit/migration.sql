/*
  Warnings:

  - You are about to alter the column `amount` on the `Budget` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - A unique constraint covering the columns `[userId,month,year]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `year` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `month` on the `Budget` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `date` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('INCOME', 'EXPENSE');

-- DropIndex
DROP INDEX "Category_type_key";

-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "year" INTEGER NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2),
DROP COLUMN "month",
ADD COLUMN     "month" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "type",
ADD COLUMN     "type" "CategoryType" NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "type" "CategoryType" NOT NULL,
ALTER COLUMN "amount" DROP DEFAULT,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Budget_userId_month_year_key" ON "Budget"("userId", "month", "year");
