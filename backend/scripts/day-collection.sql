-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 16 Des 2025 pada 06.20
-- Versi server: 8.0.30
-- Versi PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `day-collection`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `banner`
--

CREATE TABLE `banner` (
  `id` int NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `banner`
--

INSERT INTO `banner` (`id`, `title`, `image_url`, `is_active`, `created_at`) VALUES
(3, 'banner 1 (edited)', 'https://res.cloudinary.com/dgvakrkiz/image/upload/v1764772596/banner/advuyqz7skx3pt6vcztp.png', 1, '2025-11-01 23:28:01');

-- --------------------------------------------------------

--
-- Struktur dari tabel `marketplace_link`
--

CREATE TABLE `marketplace_link` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `platform_id` int NOT NULL,
  `url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `marketplace_link`
--

INSERT INTO `marketplace_link` (`id`, `product_id`, `platform_id`, `url`, `is_active`, `created_at`) VALUES
(5, 8, 3, 'https://localhost:5000', 1, '2025-11-06 01:26:15'),
(6, 7, 3, 'https://localhost:5000', 1, '2025-11-06 08:02:09'),
(7, 6, 3, 'https://localhost:5000', 1, '2025-11-06 08:09:08'),
(8, 4, 3, 'https://localhost:5000', 1, '2025-11-06 08:09:13'),
(9, 7, 4, 'https://www.tokopedia.com/liger-official-store/liger-handsfree-headset-earphone-l-10-metal-stereo-bass-biru-1731543200578176211?source=homepage.top_carousel.0.39123', 1, '2025-11-06 08:34:05'),
(10, 8, 3, 'https://localhost:5000', 1, '2025-11-06 09:06:30'),
(11, 7, 5, 'https://localhost:5000', 1, '2025-11-06 09:22:57'),
(13, 10, 4, 'https://www.tokopedia.co.id', 1, '2025-11-18 09:38:13'),
(14, 10, 5, 'https://www.lazada.co.id', 1, '2025-11-18 09:38:27'),
(15, 10, 18, 'blibli.com', 1, '2025-11-18 09:43:46'),
(16, 11, 4, 'https://tk.tokopedia.com/ZSPYC59RQ/', 1, '2025-12-10 06:58:14'),
(17, 12, 5, 'http://lazada.co.id/products/pdp-i7095734058-s13392326547.html?pvid=d748aa4e-d3c5-44b6-843b-e9507080ad51&search=jfy&scm=1007.17519.386432.0&priceCompare=skuId%3A13392326547%3Bsource%3Atpp-recommend-plugin-32104%3Bsn%3Ad748aa4e-d3c5-44b6-843b-e9507080ad51%3BoriginPrice%3A42660000%3BdisplayPrice%3A42660000%3BsinglePromotionId%3A910000044816456%3BsingleToolCode%3AmillionSubsidy%3BvoucherPricePlugin%3A0%3Btimestamp%3A1765625298388&spm=a2o4j.homepage.just4u.d_7095734058', 1, '2025-12-13 04:28:47');

-- --------------------------------------------------------

--
-- Struktur dari tabel `marketplace_platform`
--

CREATE TABLE `marketplace_platform` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `marketplace_platform`
--

INSERT INTO `marketplace_platform` (`id`, `name`, `created_at`) VALUES
(3, 'Shopee', '2025-11-01 23:19:19'),
(4, 'Tokopedia', '2025-11-06 08:33:37'),
(5, 'Lazada', '2025-11-06 09:22:45'),
(18, 'Blibli', '2025-11-18 09:42:56');

-- --------------------------------------------------------

--
-- Struktur dari tabel `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `main_image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `products`
--

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `main_image`, `base_price`, `status`, `created_at`, `updated_at`) VALUES
(4, 'Produk 1 (edited)', 'produk-1', 'Contoh Produk 1', 'https://res.cloudinary.com/dgvakrkiz/image/upload/v1765632675/product_main_image/iz7iyxv5sgdlgrbelo9u.jpg', 285000.00, 'active', '2025-11-01 23:06:21', '2025-12-13 06:31:16'),
(6, 'Produk 2', 'produk-2', 'Produk 2', 'https://res.cloudinary.com/dgvakrkiz/image/upload/v1762268447/product_main_image/jybvcf0n9qfe53fgym8g.jpg', 167000.00, 'active', '2025-11-04 08:00:47', '2025-11-04 08:00:47'),
(7, 'Produk 3', 'produk-3', 'Produk 3', 'https://res.cloudinary.com/dgvakrkiz/image/upload/v1762270053/product_main_image/p6pvkwj67stdz67x2y6u.jpg', 126000.00, 'active', '2025-11-04 08:27:33', '2025-11-04 08:29:05'),
(8, 'Produk 4', 'produk-4', 'Produk 4', 'https://res.cloudinary.com/dgvakrkiz/image/upload/v1762362820/product_main_image/vwnnefcq2wogd2cftzon.jpg', 96000.00, 'active', '2025-11-05 10:13:39', '2025-11-05 10:13:39'),
(10, 'Produk 5', 'produk-5', 'ini deskripsi produk 5', 'https://res.cloudinary.com/dgvakrkiz/image/upload/v1763301911/product_main_image/az8ne1an9krft6hulrvn.jpg', 189000.00, 'active', '2025-11-16 07:05:11', '2025-11-16 07:05:11'),
(11, 'Produk 6', 'produk-6', 'ini deskripsi produk 6', 'https://res.cloudinary.com/dgvakrkiz/image/upload/v1764769530/product_main_image/lwc1mgnfpz2jypr7idew.jpg', 176000.00, 'active', '2025-11-21 06:57:14', '2025-12-03 06:45:31'),
(12, 'Produk 7', 'produk-7', 'ini deskripsi produk 7', 'https://res.cloudinary.com/dgvakrkiz/image/upload/v1765530618/product_main_image/nkpsdnaqy4wxq1um5cqy.jpg', 158000.00, 'active', '2025-12-12 02:10:20', '2025-12-12 02:10:20');

-- --------------------------------------------------------

--
-- Struktur dari tabel `product_color`
--

CREATE TABLE `product_color` (
  `id` int NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hex_code` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `product_gallery`
--

CREATE TABLE `product_gallery` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt_text` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `product_size`
--

CREATE TABLE `product_size` (
  `id` int NOT NULL,
  `name` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `product_variant`
--

CREATE TABLE `product_variant` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `color_id` int NOT NULL,
  `size_id` int NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `settings`
--

CREATE TABLE `settings` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `settings`
--

INSERT INTO `settings` (`id`, `name`, `value`, `created_at`, `updated_at`) VALUES
(3, 'deskripsi', 'Platform belanja sederhana dengan pilihan produk berkualitas dan tampilan minimalis dan modern.', '2025-11-05 06:48:26', '2025-11-05 06:48:26'),
(4, 'email', 'support@daycollection.com', '2025-11-05 08:00:12', '2025-11-05 08:00:12'),
(5, 'telepon', '+62 873-0976-3784', '2025-11-05 08:00:41', '2025-11-05 08:00:41'),
(6, 'alamat', 'Jl. Kopo Sayati No.218, Sayati, Kec. Margahayu, Kabupaten Bandung, Jawa Barat 40226', '2025-11-05 08:02:30', '2025-11-05 08:02:30');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `email`, `password`, `created_at`) VALUES
(1, 'Admin', 'admin', 'admin@example.com', '$2b$10$TJSWJaAHxpECvPZKxqaOKe0tLjQg8eRaIt5Cq0USnZ1I/l47sdX2m', '2025-10-27 08:27:11'),
(2, 'Admin2', 'admin2', 'admin2@example.com', '$2b$10$exPwcE5mSfNBJ3S1r97xTeh.ZT2EMID3zsfFn7ZTOembQex/aXc9q', '2025-11-01 23:04:31');

-- --------------------------------------------------------

--
-- Struktur dari tabel `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('59ef1983-6119-4410-876e-c42ef678782b', '318eff046f01b56c67561bcff63de537011433a9146ec60f059421058d28690f', '2025-10-25 13:45:08.739', '20251025134508_init', NULL, NULL, '2025-10-25 13:45:08.415', 1),
('691c5dc4-62ca-423a-8321-9c6790c550ee', '2875455f146b91e29e8d77e99af4ce087fe09520626267a5d0160a22abdceb60', '2025-12-13 11:26:27.603', '20251213112627_change_column_type', NULL, NULL, '2025-12-13 11:26:27.531', 1),
('92d7aa8e-25c6-4b49-988d-8605973f8b2d', '16b4fbbb4300a0919f22bb0d92ba96d3132194644d8af108ef8b8dbcae20ad72', '2025-10-31 17:56:50.931', '20251031175650_add_on_delete_cascade_for_foreign_key_product', NULL, NULL, '2025-10-31 17:56:50.798', 1),
('9e19c9a1-17db-475f-bfac-a97705ded390', '8fba2f88ef49821fbba12a4e53b2a26b884dd51604328864dc44e13da255f8a4', '2025-12-02 06:32:09.650', '20251202063209_remove_link_column_from_banner_table', NULL, NULL, '2025-12-02 06:32:09.625', 1),
('fcdbaf82-486c-41ea-9f58-f7ec6f8107ed', 'e6531e20b5722311628d018ef94a03e1490879e5d1ec3da625eaab02b1f6d31e', '2025-10-25 17:10:25.185', '20251025171025_add_price_column_in_product_variant_table', NULL, NULL, '2025-10-25 17:10:25.156', 1);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `banner`
--
ALTER TABLE `banner`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `marketplace_link`
--
ALTER TABLE `marketplace_link`
  ADD PRIMARY KEY (`id`),
  ADD KEY `platform_id` (`platform_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indeks untuk tabel `marketplace_platform`
--
ALTER TABLE `marketplace_platform`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `product_color`
--
ALTER TABLE `product_color`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `product_gallery`
--
ALTER TABLE `product_gallery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indeks untuk tabel `product_size`
--
ALTER TABLE `product_size`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `product_variant`
--
ALTER TABLE `product_variant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `color_id` (`color_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `size_id` (`size_id`);

--
-- Indeks untuk tabel `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indeks untuk tabel `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `banner`
--
ALTER TABLE `banner`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `marketplace_link`
--
ALTER TABLE `marketplace_link`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT untuk tabel `marketplace_platform`
--
ALTER TABLE `marketplace_platform`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT untuk tabel `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `product_color`
--
ALTER TABLE `product_color`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `product_gallery`
--
ALTER TABLE `product_gallery`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `product_size`
--
ALTER TABLE `product_size`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `product_variant`
--
ALTER TABLE `product_variant`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `marketplace_link`
--
ALTER TABLE `marketplace_link`
  ADD CONSTRAINT `marketplace_link_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT `marketplace_link_ibfk_2` FOREIGN KEY (`platform_id`) REFERENCES `marketplace_platform` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Ketidakleluasaan untuk tabel `product_gallery`
--
ALTER TABLE `product_gallery`
  ADD CONSTRAINT `product_gallery_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Ketidakleluasaan untuk tabel `product_variant`
--
ALTER TABLE `product_variant`
  ADD CONSTRAINT `product_variant_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `product_variant_ibfk_2` FOREIGN KEY (`color_id`) REFERENCES `product_color` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `product_variant_ibfk_3` FOREIGN KEY (`size_id`) REFERENCES `product_size` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
