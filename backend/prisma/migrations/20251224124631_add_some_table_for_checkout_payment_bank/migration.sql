/*
  Warnings:

  - You are about to drop the column `address` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `order` table. All the data in the column will be lost.
  - The values [WAITING_CONFIRMATION,REJECTED] on the enum `order_status` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `buyer_address` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyer_phone` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkout_method` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_amount` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `update_at` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `address`,
    DROP COLUMN `phone`,
    ADD COLUMN `buyer_address` TEXT NOT NULL,
    ADD COLUMN `buyer_phone` VARCHAR(191) NOT NULL,
    ADD COLUMN `checkout_method` ENUM('MARKETPLACE', 'BANK_TRANSFER') NOT NULL,
    ADD COLUMN `paymentProof` VARCHAR(191) NULL,
    ADD COLUMN `total_amount` INTEGER NOT NULL,
    ADD COLUMN `update_at` DATETIME(3) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'WAITING_PAYMENT', 'WAITING_VERIFICATION', 'PAID', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `payment_proof` ADD COLUMN `verified_at` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `order_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `variant_id` INTEGER NULL,
    `quantity` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_variants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `size` VARCHAR(191) NOT NULL,
    `price` INTEGER NULL,
    `stock` INTEGER NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_variant_options` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `variant_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `product_variantsId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_variant_id_fkey` FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variants` ADD CONSTRAINT `product_variants_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variant_options` ADD CONSTRAINT `product_variant_options_variant_id_fkey` FOREIGN KEY (`variant_id`) REFERENCES `product_variant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variant_options` ADD CONSTRAINT `product_variant_options_product_variantsId_fkey` FOREIGN KEY (`product_variantsId`) REFERENCES `product_variants`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
