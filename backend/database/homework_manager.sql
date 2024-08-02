-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 02, 2024 at 11:18 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `homework_manager`
--

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `due_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `completed` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`id`, `user_id`, `title`, `description`, `due_date`, `created_at`, `completed`) VALUES
(14, 13, 'sss', 'sss', '2024-08-16', '2024-07-31 16:54:02', 0),
(15, 13, 'gago', 'gago', '2024-08-16', '2024-07-31 16:54:49', 0),
(17, 12, 'test1', 'test1', '2024-08-02', '2024-07-31 17:09:33', 0),
(19, 12, 'umay', 'sss', '2024-09-07', '2024-08-01 14:23:23', 0),
(20, 12, 'test', 'test', '2024-08-01', '2024-08-01 15:46:31', 0),
(21, 12, 'sss', 'sss', '2024-08-02', '2024-08-01 16:22:25', 0);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `message` text NOT NULL,
  `dateCreated` timestamp NOT NULL DEFAULT current_timestamp(),
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `message`, `dateCreated`, `userId`) VALUES
(1, 'ss', '2024-08-01 14:37:56', 0),
(2, 'gago', '2024-08-01 14:38:53', 0),
(3, 'sss', '2024-08-01 14:43:28', 0),
(4, 'sss', '2024-08-01 14:43:43', 0),
(5, 'sss', '2024-08-01 14:43:55', 0),
(6, 'sss', '2024-08-01 14:43:57', 0),
(7, 'sss', '2024-08-01 14:43:59', 0),
(8, 'ssss', '2024-08-01 14:44:01', 0),
(9, 'ssss', '2024-08-01 14:44:03', 0),
(10, 'sss', '2024-08-01 14:44:08', 0),
(11, 'sss', '2024-08-01 14:44:11', 0),
(12, 'ss', '2024-08-01 14:46:14', 0),
(13, 's', '2024-08-01 14:46:18', 0),
(14, 'ss', '2024-08-01 14:48:14', 0),
(15, 'test', '2024-08-01 14:53:21', 0),
(16, 'hi', '2024-08-01 14:54:41', 0),
(17, 'ss', '2024-08-01 14:56:52', 0),
(18, 'hello', '2024-08-01 15:02:43', 0),
(19, 'ss', '2024-08-01 15:06:20', 1),
(20, 'tstss', '2024-08-01 15:06:31', 1),
(21, 'ss', '2024-08-01 15:08:05', 1),
(22, 'sss', '2024-08-01 15:10:02', 1),
(23, 'sss', '2024-08-01 15:10:38', 0),
(24, 'test', '2024-08-01 15:10:52', 0),
(25, 'ssss', '2024-08-01 15:11:35', 0),
(26, 'hi', '2024-08-01 15:12:28', 0),
(27, 'hello', '2024-08-01 15:14:06', 0),
(28, 'hello', '2024-08-01 15:15:31', 0),
(29, 'ss', '2024-08-01 15:16:50', 0),
(30, 'sss', '2024-08-01 15:16:58', 0),
(31, 'sshahhahaha', '2024-08-01 15:26:29', 0),
(32, 'test', '2024-08-01 15:28:04', 0),
(33, 'ss', '2024-08-01 15:31:03', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `email` varchar(200) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `created_at`, `email`, `user_id`) VALUES
(11, 'tite', '$2b$10$4rFJwkeJRA5At1Skan5Kl.ffmg.0hiWdbY/SBnOdpfL5oRO2rAg3O', '2024-07-31 15:31:01', 'wasieacuna@gmail.com', 0),
(12, 'rens', '$2b$10$DhlLyvaMNaRDYMEKyM7iYO6A3w9rR1DPKsTAb34pIYUcTmKP2PNIq', '2024-07-31 16:26:28', 'wasieacuna@gmail.com', 0),
(13, 'meow', '$2b$10$ZXK/ji2sdAFe6yZvqGEv5O/5Z.oISlqnw4k1KYYe4jAq.d9EkcI5i', '2024-07-31 16:34:40', 'wasie@gmail.com', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
