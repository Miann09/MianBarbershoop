-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 30, 2025 at 09:59 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `barbershop_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id_admin` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id_admin`, `nama`, `email`, `password`, `created_at`) VALUES
(1, 'Admin Barbershop', 'admin@barber.com', 'admin123', '2025-07-13 18:45:07');

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `id_booking` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `telepon` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `tanggal` date NOT NULL,
  `jam` time NOT NULL,
  `paket` varchar(50) NOT NULL,
  `catatan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `rating` int(1) DEFAULT NULL,
  `whatsapp` varchar(20) DEFAULT NULL,
  `barber` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'menunggu'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`id_booking`, `nama`, `telepon`, `email`, `tanggal`, `jam`, `paket`, `catatan`, `created_at`, `rating`, `whatsapp`, `barber`, `status`) VALUES
(1, 'Hotmian', '0824346876634', 'mian@gmail.com', '2025-06-11', '07:00:00', 'Cukur + Facial', 'Wolfcut', '2025-06-30 07:02:05', 4, '', 'Ali', 'menunggu'),
(2, 'Jonathan', '084567891267', 'jo@gmail.com', '2025-07-01', '13:10:00', 'Cukur Rambut', '', '2025-06-30 07:54:10', 3, '', 'Ali', 'menunggu'),
(3, 'Samuel', '0734236353733', 'samuel@hotmian.com', '2025-07-08', '18:30:00', 'Cukur Rambut', 'Wolfcut dan Mullet', '2025-07-06 19:34:37', 5, '', 'B', 'menunggu'),
(5, 'Lala', '03642735253423', 'lala@gmail.com', '2025-06-12', '23:59:00', 'Cukur Anak', 'Omak', '2025-07-13 14:35:52', 5, '', 'B', 'menunggu'),
(6, 'Semua', '0812352837523', 'semua@gmail.com', '2025-07-16', '23:00:00', 'Cukur + Facial', 'Omak', '2025-07-13 15:02:53', 5, '', 'B', 'diterima'),
(9, 'sdfa', '0374692738476', 'wetawhtf@cff.com', '2025-07-08', '14:41:00', 'Cukur + Facial', 'ehdaiwuh', '2025-07-14 06:43:53', 1, '', 'Ali', 'menunggu');

-- --------------------------------------------------------

--
-- Table structure for table `pengaturan`
--

CREATE TABLE `pengaturan` (
  `id` int(11) NOT NULL,
  `jam_buka` time DEFAULT NULL,
  `jam_tutup` time DEFAULT NULL,
  `hari_libur` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pengaturan`
--

INSERT INTO `pengaturan` (`id`, `jam_buka`, `jam_tutup`, `hari_libur`) VALUES
(1, '17:00:00', '22:00:00', 'Senin');

-- --------------------------------------------------------

--
-- Table structure for table `pengguna`
--

CREATE TABLE `pengguna` (
  `id_pengguna` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telepon` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pengguna`
--

INSERT INTO `pengguna` (`id_pengguna`, `nama`, `email`, `telepon`, `password`, `created_at`) VALUES
(1, 'Mian Dolok', 'mian@gmail.com', '085212345678', 'user123', '2025-07-13 18:45:07');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id_admin`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`id_booking`);

--
-- Indexes for table `pengaturan`
--
ALTER TABLE `pengaturan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pengguna`
--
ALTER TABLE `pengguna`
  ADD PRIMARY KEY (`id_pengguna`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `telepon` (`telepon`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `id_booking` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `pengguna`
--
ALTER TABLE `pengguna`
  MODIFY `id_pengguna` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
