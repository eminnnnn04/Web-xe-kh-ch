-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 19, 2026 at 07:27 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bus_booking`
--

-- --------------------------------------------------------

--
-- Table structure for table `buses`
--

CREATE TABLE `buses` (
  `id` int(11) NOT NULL,
  `bus_name` varchar(100) DEFAULT NULL,
  `seat_count` int(11) DEFAULT NULL,
  `company_id` int(11) NOT NULL,
  `bustype_id` int(11) NOT NULL,
  `license_plate` varchar(20) DEFAULT NULL,
  `status` enum('active','inactive','maintenance') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buses`
--

INSERT INTO `buses` (`id`, `bus_name`, `seat_count`, `company_id`, `bustype_id`, `license_plate`, `status`) VALUES
(1, 'Xe 32 chỗ Văn Liêu', 32, 1, 1, '51A-83921', 'active'),
(2, 'Xe 24 chỗ Văn Liêu', 24, 1, 2, '51A-27465', 'active'),
(3, 'Xe 32 chỗ An', 32, 2, 1, '51B-19283', 'active'),
(4, 'Xe 24 chỗ An', 24, 2, 2, '51B-65748', 'active'),
(5, 'Xe 32 chỗ Thanh Minh', 32, 3, 1, '51C-38475', 'active'),
(6, 'Xe 24 chỗ Thanh Minh', 24, 3, 2, '51C-91827', 'active'),
(7, 'Xe 32 chỗ Ngọc Hân', 32, 4, 1, '51D-74629', 'active'),
(8, 'Xe 24 chỗ Ngọc Hân', 24, 4, 2, '51D-28591', 'active'),
(9, 'Xe 32 chỗ Quốc Huy', 32, 5, 1, '51E-56382', 'active'),
(10, 'Xe 24 chỗ Quốc Huy', 24, 5, 2, '51E-12947', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `bus_types`
--

CREATE TABLE `bus_types` (
  `id` int(11) NOT NULL,
  `type_name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bus_types`
--

INSERT INTO `bus_types` (`id`, `type_name`, `description`) VALUES
(1, 'Giường nằm', 'Xe 32 chỗ '),
(2, 'Limousine', 'Xe 24 chỗ ');

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` int(11) NOT NULL,
  `ten_hang` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `ten_hang`) VALUES
(1, 'Văn Liêu'),
(2, 'An'),
(3, 'Thanh Minh'),
(4, 'Ngọc Hân'),
(5, 'Quốc Huy');

-- --------------------------------------------------------

--
-- Table structure for table `routes`
--

CREATE TABLE `routes` (
  `id` int(11) NOT NULL,
  `departure` varchar(100) DEFAULT NULL,
  `destination` varchar(100) DEFAULT NULL,
  `duration_hours` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `routes`
--

INSERT INTO `routes` (`id`, `departure`, `destination`, `duration_hours`) VALUES
(1, 'TP.HCM', 'Vũng Tàu', 2),
(2, 'TP.HCM', 'Tây Ninh', 3),
(3, 'TP.HCM', 'Bình Dương', 1),
(4, 'TP.HCM', 'Đà Lạt', 7),
(5, 'TP.HCM', 'Buôn Ma Thuột', 8),
(6, 'TP.HCM', 'Gia Lai', 11),
(7, 'TP.HCM', 'Kon Tum', 13),
(8, 'TP.HCM', 'Cần Thơ', 3),
(9, 'TP.HCM', 'Cà Mau', 8),
(10, 'TP.HCM', 'Bạc Liêu', 6),
(11, 'TP.HCM', 'Bến Tre', 2),
(12, 'TP.HCM', 'Nha Trang', 9),
(13, 'TP.HCM', 'Quy Nhơn', 12),
(14, 'TP.HCM', 'Đà Nẵng', 17),
(15, 'TP.HCM', 'Quảng Trị', 21),
(16, 'TP.HCM', 'Phan Thiết', 3),
(17, 'TP.HCM', 'Hà Nội', 32),
(18, 'TP.HCM', 'Ninh Bình', 30);

-- --------------------------------------------------------

--
-- Table structure for table `route_prices`
--

CREATE TABLE `route_prices` (
  `id` int(11) NOT NULL,
  `route_id` int(11) DEFAULT NULL,
  `base_price` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `route_prices`
--

INSERT INTO `route_prices` (`id`, `route_id`, `base_price`) VALUES
(1, 1, 180000),
(2, 2, 120000),
(3, 3, 80000),
(4, 4, 290000),
(5, 5, 320000),
(6, 6, 350000),
(7, 7, 380000),
(8, 8, 165000),
(9, 9, 230000),
(10, 10, 210000),
(11, 11, 110000),
(12, 12, 300000),
(13, 13, 350000),
(14, 14, 450000),
(15, 15, 650000),
(16, 16, 200000),
(17, 17, 1000000),
(18, 18, 950000);

-- --------------------------------------------------------

--
-- Table structure for table `seats`
--

CREATE TABLE `seats` (
  `id` int(11) NOT NULL,
  `bus_id` int(11) DEFAULT NULL,
  `seat_number` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trips`
--

CREATE TABLE `trips` (
  `id` int(11) NOT NULL,
  `route_id` int(11) NOT NULL,
  `bus_id` int(11) NOT NULL,
  `departure_time` datetime NOT NULL,
  `status` varchar(20) DEFAULT 'active',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trips`
--

INSERT INTO `trips` (`id`, `route_id`, `bus_id`, `departure_time`, `status`, `created_at`) VALUES
(1, 1, 7, '2026-03-21 08:00:00', 'active', '2026-03-20 00:17:25'),
(2, 1, 8, '2026-03-21 18:00:00', 'active', '2026-03-20 00:17:25'),
(3, 2, 9, '2026-03-22 07:30:00', 'active', '2026-03-20 00:17:25'),
(4, 2, 10, '2026-03-22 17:30:00', 'active', '2026-03-20 00:17:25'),
(5, 3, 1, '2026-03-22 06:00:00', 'active', '2026-03-20 00:17:25'),
(6, 3, 2, '2026-03-22 16:00:00', 'active', '2026-03-20 00:17:25'),
(7, 4, 3, '2026-03-20 07:00:00', 'active', '2026-03-20 00:17:25'),
(8, 4, 4, '2026-03-20 18:00:00', 'active', '2026-03-20 00:17:25'),
(9, 5, 3, '2026-03-22 08:00:00', 'active', '2026-03-20 00:17:25'),
(10, 5, 4, '2026-03-22 20:00:00', 'active', '2026-03-20 00:17:25'),
(11, 6, 5, '2026-03-23 07:00:00', 'active', '2026-03-20 00:17:25'),
(12, 6, 6, '2026-03-23 19:00:00', 'active', '2026-03-20 00:17:25'),
(13, 7, 7, '2026-03-23 06:00:00', 'active', '2026-03-20 00:17:25'),
(14, 7, 8, '2026-03-23 18:00:00', 'active', '2026-03-20 00:17:25'),
(15, 8, 9, '2026-03-20 05:00:00', 'active', '2026-03-20 00:17:25'),
(16, 8, 10, '2026-03-20 17:00:00', 'active', '2026-03-20 00:17:25'),
(17, 9, 1, '2026-03-21 06:00:00', 'active', '2026-03-20 00:17:25'),
(18, 9, 2, '2026-03-21 18:00:00', 'active', '2026-03-20 00:17:25'),
(19, 10, 3, '2026-03-21 07:00:00', 'active', '2026-03-20 00:17:25'),
(20, 10, 4, '2026-03-21 19:00:00', 'active', '2026-03-20 00:17:25'),
(21, 11, 5, '2026-03-21 06:30:00', 'active', '2026-03-20 00:17:25'),
(22, 11, 6, '2026-03-21 17:30:00', 'active', '2026-03-20 00:17:25'),
(23, 12, 5, '2026-03-20 06:00:00', 'active', '2026-03-20 00:17:25'),
(24, 12, 6, '2026-03-20 19:00:00', 'active', '2026-03-20 00:17:25'),
(25, 13, 9, '2026-03-23 08:00:00', 'active', '2026-03-20 00:17:25'),
(26, 13, 10, '2026-03-23 20:00:00', 'active', '2026-03-20 00:17:25'),
(27, 14, 7, '2026-03-20 09:00:00', 'active', '2026-03-20 00:17:25'),
(28, 14, 8, '2026-03-20 21:00:00', 'active', '2026-03-20 00:17:25'),
(29, 15, 1, '2026-03-24 07:00:00', 'active', '2026-03-20 00:17:25'),
(30, 15, 2, '2026-03-24 19:00:00', 'active', '2026-03-20 00:17:25'),
(31, 16, 3, '2026-03-24 06:00:00', 'active', '2026-03-20 00:17:25'),
(32, 16, 4, '2026-03-24 16:00:00', 'active', '2026-03-20 00:17:25'),
(33, 17, 1, '2026-03-20 08:00:00', 'active', '2026-03-20 00:17:25'),
(34, 17, 2, '2026-03-20 20:00:00', 'active', '2026-03-20 00:17:25'),
(35, 18, 5, '2026-03-24 08:00:00', 'active', '2026-03-20 00:17:25'),
(36, 18, 6, '2026-03-24 20:00:00', 'active', '2026-03-20 00:17:25');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`) VALUES
(1, 'test', 'test@gmail.com', 'minh080504', '0123456789');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `buses`
--
ALTER TABLE `buses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bus_types`
--
ALTER TABLE `bus_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `routes`
--
ALTER TABLE `routes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `route_prices`
--
ALTER TABLE `route_prices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `route_id` (`route_id`);

--
-- Indexes for table `seats`
--
ALTER TABLE `seats`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `trips`
--
ALTER TABLE `trips`
  ADD PRIMARY KEY (`id`),
  ADD KEY `route_id` (`route_id`),
  ADD KEY `bus_id` (`bus_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `buses`
--
ALTER TABLE `buses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `bus_types`
--
ALTER TABLE `bus_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `routes`
--
ALTER TABLE `routes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `route_prices`
--
ALTER TABLE `route_prices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `seats`
--
ALTER TABLE `seats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `trips`
--
ALTER TABLE `trips`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `route_prices`
--
ALTER TABLE `route_prices`
  ADD CONSTRAINT `route_prices_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`);

--
-- Constraints for table `trips`
--
ALTER TABLE `trips`
  ADD CONSTRAINT `trips_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`),
  ADD CONSTRAINT `trips_ibfk_2` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
