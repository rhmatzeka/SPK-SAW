-- SPK SAW MySQL 8 dump
-- Import this file into MySQL/phpMyAdmin.
-- Default database: spk_saw

CREATE DATABASE IF NOT EXISTS `spk_saw`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `spk_saw`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `perhitungan_detail`;
DROP TABLE IF EXISTS `perhitungan`;
DROP TABLE IF EXISTS `nilai_alternatif`;
DROP TABLE IF EXISTS `alternatif`;
DROP TABLE IF EXISTS `kriteria`;
DROP TABLE IF EXISTS `personal_access_tokens`;
DROP TABLE IF EXISTS `failed_jobs`;
DROP TABLE IF EXISTS `job_batches`;
DROP TABLE IF EXISTS `jobs`;
DROP TABLE IF EXISTS `cache_locks`;
DROP TABLE IF EXISTS `cache`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `password_reset_tokens`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin','user') NOT NULL DEFAULT 'user',
  `remember_token` VARCHAR(100) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `password_reset_tokens` (
  `email` VARCHAR(255) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sessions` (
  `id` VARCHAR(255) NOT NULL,
  `user_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `ip_address` VARCHAR(45) NULL DEFAULT NULL,
  `user_agent` TEXT NULL,
  `payload` LONGTEXT NOT NULL,
  `last_activity` INT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cache` (
  `key` VARCHAR(255) NOT NULL,
  `value` MEDIUMTEXT NOT NULL,
  `expiration` INT NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cache_locks` (
  `key` VARCHAR(255) NOT NULL,
  `owner` VARCHAR(255) NOT NULL,
  `expiration` INT NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `jobs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` VARCHAR(255) NOT NULL,
  `payload` LONGTEXT NOT NULL,
  `attempts` TINYINT UNSIGNED NOT NULL,
  `reserved_at` INT UNSIGNED NULL DEFAULT NULL,
  `available_at` INT UNSIGNED NOT NULL,
  `created_at` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `job_batches` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `total_jobs` INT NOT NULL,
  `pending_jobs` INT NOT NULL,
  `failed_jobs` INT NOT NULL,
  `failed_job_ids` LONGTEXT NOT NULL,
  `options` MEDIUMTEXT NULL,
  `cancelled_at` INT NULL DEFAULT NULL,
  `created_at` INT NOT NULL,
  `finished_at` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `failed_jobs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` VARCHAR(255) NOT NULL,
  `connection` TEXT NOT NULL,
  `queue` TEXT NOT NULL,
  `payload` LONGTEXT NOT NULL,
  `exception` LONGTEXT NOT NULL,
  `failed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `personal_access_tokens` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` VARCHAR(255) NOT NULL,
  `tokenable_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `token` VARCHAR(64) NOT NULL,
  `abilities` TEXT NULL,
  `last_used_at` TIMESTAMP NULL DEFAULT NULL,
  `expires_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`, `tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `kriteria` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(255) NOT NULL,
  `bobot` DECIMAL(5,4) NOT NULL,
  `jenis` ENUM('benefit','cost') NOT NULL,
  `keterangan` TEXT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `alternatif` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(255) NOT NULL,
  `deskripsi` TEXT NULL,
  `foto` VARCHAR(255) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `nilai_alternatif` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `alternatif_id` BIGINT UNSIGNED NOT NULL,
  `kriteria_id` BIGINT UNSIGNED NOT NULL,
  `nilai` DECIMAL(10,4) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nilai_alternatif_unique` (`alternatif_id`, `kriteria_id`),
  KEY `nilai_alternatif_kriteria_id_foreign` (`kriteria_id`),
  CONSTRAINT `nilai_alternatif_alternatif_id_foreign` FOREIGN KEY (`alternatif_id`) REFERENCES `alternatif` (`id`) ON DELETE CASCADE,
  CONSTRAINT `nilai_alternatif_kriteria_id_foreign` FOREIGN KEY (`kriteria_id`) REFERENCES `kriteria` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `perhitungan` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama_sesi` VARCHAR(255) NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `hasil` JSON NOT NULL,
  `status` VARCHAR(255) NOT NULL DEFAULT 'completed',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `perhitungan_user_id_foreign` (`user_id`),
  CONSTRAINT `perhitungan_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `perhitungan_detail` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `perhitungan_id` BIGINT UNSIGNED NOT NULL,
  `alternatif_id` BIGINT UNSIGNED NOT NULL,
  `skor` DECIMAL(10,6) NOT NULL,
  `ranking` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `perhitungan_detail_perhitungan_id_foreign` (`perhitungan_id`),
  KEY `perhitungan_detail_alternatif_id_foreign` (`alternatif_id`),
  CONSTRAINT `perhitungan_detail_perhitungan_id_foreign` FOREIGN KEY (`perhitungan_id`) REFERENCES `perhitungan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `perhitungan_detail_alternatif_id_foreign` FOREIGN KEY (`alternatif_id`) REFERENCES `alternatif` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Administrator SPK', 'admin@spk.test', NOW(), '$2y$10$axLZbTPrsnjYmOed.jPEweX04kGSSnI9zA8uhK4oLbSiggqNWSTQ6', 'admin', 'seedtokenadmin', NOW(), NOW()),
(2, 'User SPK', 'user@spk.test', NOW(), '$2y$10$axLZbTPrsnjYmOed.jPEweX04kGSSnI9zA8uhK4oLbSiggqNWSTQ6', 'user', 'seedtokenuser', NOW(), NOW());

INSERT INTO `kriteria` (`id`, `nama`, `bobot`, `jenis`, `keterangan`, `created_at`, `updated_at`) VALUES
(1, 'Pengalaman Kerja', 0.2500, 'benefit', 'Semakin tinggi pengalaman semakin baik.', NOW(), NOW()),
(2, 'Pendidikan', 0.2000, 'benefit', 'Jenjang pendidikan terakhir.', NOW(), NOW()),
(3, 'Tes Kompetensi', 0.2500, 'benefit', 'Skor tes kemampuan teknis.', NOW(), NOW()),
(4, 'Usia', 0.1000, 'cost', 'Semakin kecil usia semakin baik sesuai kebutuhan.', NOW(), NOW()),
(5, 'Wawancara', 0.2000, 'benefit', 'Penilaian wawancara akhir.', NOW(), NOW());

INSERT INTO `alternatif` (`id`, `nama`, `deskripsi`, `foto`, `created_at`, `updated_at`) VALUES
(1, 'Andi Pratama', 'Kandidat backend engineer berpengalaman di Laravel dan MySQL.', NULL, NOW(), NOW()),
(2, 'Bunga Lestari', 'Kandidat data analyst dengan kemampuan presentasi yang kuat.', NULL, NOW(), NOW()),
(3, 'Cahyo Saputra', 'Kandidat full-stack dengan pengalaman startup 3 tahun.', NULL, NOW(), NOW()),
(4, 'Dina Maharani', 'Kandidat UI engineer dengan portfolio enterprise.', NULL, NOW(), NOW()),
(5, 'Eko Firmansyah', 'Kandidat mobile developer dengan adaptasi cepat.', NULL, NOW(), NOW());

INSERT INTO `nilai_alternatif` (`id`, `alternatif_id`, `kriteria_id`, `nilai`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 85.0000, NOW(), NOW()),
(2, 1, 2, 80.0000, NOW(), NOW()),
(3, 1, 3, 88.0000, NOW(), NOW()),
(4, 1, 4, 29.0000, NOW(), NOW()),
(5, 1, 5, 90.0000, NOW(), NOW()),
(6, 2, 1, 78.0000, NOW(), NOW()),
(7, 2, 2, 85.0000, NOW(), NOW()),
(8, 2, 3, 84.0000, NOW(), NOW()),
(9, 2, 4, 27.0000, NOW(), NOW()),
(10, 2, 5, 88.0000, NOW(), NOW()),
(11, 3, 1, 90.0000, NOW(), NOW()),
(12, 3, 2, 82.0000, NOW(), NOW()),
(13, 3, 3, 92.0000, NOW(), NOW()),
(14, 3, 4, 31.0000, NOW(), NOW()),
(15, 3, 5, 89.0000, NOW(), NOW()),
(16, 4, 1, 82.0000, NOW(), NOW()),
(17, 4, 2, 88.0000, NOW(), NOW()),
(18, 4, 3, 86.0000, NOW(), NOW()),
(19, 4, 4, 26.0000, NOW(), NOW()),
(20, 4, 5, 91.0000, NOW(), NOW()),
(21, 5, 1, 76.0000, NOW(), NOW()),
(22, 5, 2, 79.0000, NOW(), NOW()),
(23, 5, 3, 80.0000, NOW(), NOW()),
(24, 5, 4, 25.0000, NOW(), NOW()),
(25, 5, 5, 85.0000, NOW(), NOW());

SET FOREIGN_KEY_CHECKS = 1;

-- Login seed:
-- admin@spk.test / password
-- user@spk.test / password
--
-- Seed ranking reference from the same matrix:
-- 1. Cahyo Saputra = 0.962613
-- 2. Dina Maharani = 0.957627
-- 3. Andi Pratama = 0.941069
-- 4. Bunga Lestari = 0.924109
-- 5. Eko Firmansyah = 0.894861
