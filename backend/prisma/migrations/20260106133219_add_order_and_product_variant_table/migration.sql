/*
  Warnings:

  - You are about to drop the `product_color` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_size` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_variant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_variant_options` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `product_variant` DROP FOREIGN KEY `product_variant_ibfk_1`;

-- DropForeignKey
ALTER TABLE `product_variant` DROP FOREIGN KEY `product_variant_ibfk_2`;

-- DropForeignKey
ALTER TABLE `product_variant` DROP FOREIGN KEY `product_variant_ibfk_3`;

-- DropForeignKey
ALTER TABLE `product_variant_options` DROP FOREIGN KEY `product_variant_options_product_variantsId_fkey`;

-- DropForeignKey
ALTER TABLE `product_variant_options` DROP FOREIGN KEY `product_variant_options_variant_id_fkey`;

-- DropTable
DROP TABLE `product_color`;

-- DropTable
DROP TABLE `product_size`;

-- DropTable
DROP TABLE `product_variant`;

-- DropTable
DROP TABLE `product_variant_options`;
