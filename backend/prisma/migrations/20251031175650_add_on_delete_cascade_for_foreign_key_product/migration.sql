-- DropForeignKey
ALTER TABLE `marketplace_link` DROP FOREIGN KEY `marketplace_link_ibfk_1`;

-- DropForeignKey
ALTER TABLE `product_gallery` DROP FOREIGN KEY `product_gallery_ibfk_1`;

-- AddForeignKey
ALTER TABLE `marketplace_link` ADD CONSTRAINT `marketplace_link_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `product_gallery` ADD CONSTRAINT `product_gallery_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
