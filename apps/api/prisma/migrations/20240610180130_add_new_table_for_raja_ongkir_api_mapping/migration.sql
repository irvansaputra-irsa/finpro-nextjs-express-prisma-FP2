-- CreateTable
CREATE TABLE `RajaOngkir` (
    `city_id` INTEGER NOT NULL,
    `province_id` INTEGER NOT NULL,
    `city_name` VARCHAR(191) NOT NULL,
    `postal_code` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`city_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
