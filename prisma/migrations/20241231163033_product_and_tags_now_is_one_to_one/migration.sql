/*
  Warnings:

  - A unique constraint covering the columns `[productId]` on the table `Tags` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Tags_productId_key` ON `Tags`(`productId`);
