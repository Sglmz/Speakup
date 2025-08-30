-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-08-2025 a las 05:39:43
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `speakup_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `locked` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `locked`) VALUES
(1, 'Animals', 'Aprende los animales', 1),
(2, 'Colors', 'Aprende los colores', 0),
(3, 'Food', 'Aprende comidas', 1),
(4, 'House', 'Aprende cosas de la casa', 0),
(5, 'Letters', 'Aprende las letras', 1),
(6, 'Numbers', 'Aprende los números', 0),
(7, 'Words', 'Aprende palabras', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `games`
--

CREATE TABLE `games` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `games`
--

INSERT INTO `games` (`id`, `code`, `name`, `description`, `category_id`) VALUES
(3, 'AnimalScreen', 'Juego de Animales', 'Juego principal de animales', 1),
(4, 'ListenAndChooseScreen', 'Escucha y elige', 'Juego escuchar y elegir animal', 1),
(6, 'AnimalScreen2', 'Colors', 'Colores', 2),
(9, 'FoodGame1', 'Comida - Juego 1', 'Primer juego de comida', 3),
(13, 'OrderSentenceGame', 'Ordena la oración', 'Juego de ordenar oraciones', 4),
(17, 'CountTapGameScreen', 'Cuenta y toca', 'Juego de contar y tocar', 6),
(20, 'WordGame1', 'Palabras - Juego 1', 'Primer juego de palabras', 7),
(22, 'HouseMemoryGame', 'House · Memory', 'Empareja objetos y cuartos', 4),
(23, 'HouseWhichRoomGame', 'House · Which Room?', '¿A qué cuarto pertenece?', 4),
(24, 'HouseSpotItGame', 'House · Spot-It!', 'Encuentra el objetivo', 4),
(25, 'ColorsStroopGame', 'Colors · Stroop', 'Elige significado o color', 2),
(26, 'ColorsMixGame', 'Colors · Mix', 'Mezcla colores primarios', 2),
(27, 'ColorsSimonGame', 'Colors · Simon', 'Repite la secuencia', 2),
(28, 'NumbersSumPickGame', 'Numbers · Complete', 'Completa la suma', 6),
(29, 'NumbersCountGame', 'Numbers · Count', 'Cuenta los objetos', 6),
(30, 'NumbersEvenOddGame', 'Numbers · Even/Odd', 'Par o impar', 6),
(31, 'WordsHangmanLiteGame', 'Words · Hangman', 'Adivina con pista visual', 7),
(32, 'WordsUnscrambleGame', 'Words · Unscramble', 'Ordena las letras', 7),
(33, 'WordsMissingLetterGame', 'Words · Missing', 'Letra faltante', 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `progress`
--

CREATE TABLE `progress` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `completed_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `progress`
--

INSERT INTO `progress` (`id`, `user_id`, `game_id`, `completed_at`) VALUES
(8, 5, 20, '2025-08-19 12:32:18'),
(9, 5, 26, '2025-08-28 21:01:54'),
(10, 5, 25, '2025-08-28 21:02:17'),
(11, 5, 6, '2025-08-28 21:07:08'),
(12, 5, 27, '2025-08-29 11:00:39'),
(13, 5, 23, '2025-08-29 11:04:00'),
(14, 5, 31, '2025-08-29 11:23:00'),
(15, 5, 33, '2025-08-29 11:23:29');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `level` enum('Inicial','Medio') DEFAULT 'Inicial',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `level`, `created_at`, `last_login`) VALUES
(2, 'Salvador', 'sgaldamez1902@gmail.com', '$2y$10$FMvL/0rI.OnRCVP/SesuBua3PDzKTVnI2TyeQsbVbxYcuUZxnDKeC', 'Inicial', '2025-08-06 02:54:08', '2025-08-09 22:17:57'),
(4, 'admin', 'admin@speakup.com', '$2y$10$9HAZ.9/o8CuuzVBc9ejn2OwRwLrgc9ebsvHbpzaxTwMPXObG.nUqG', 'Inicial', '2025-08-06 02:58:19', '2025-08-19 20:28:18'),
(5, 'Elias', 'Elias@gmail.com', '$2y$10$vhbe4Y321JHH9Cjv3YTXt.Gb4JPyMQWO3Rj2N9sFEnghtqC8wVqXC', 'Inicial', '2025-08-10 00:50:26', '2025-08-29 18:18:04');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `category_id` (`category_id`);

--
-- Indices de la tabla `progress`
--
ALTER TABLE `progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_game` (`user_id`,`game_id`),
  ADD KEY `game_id` (`game_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `games`
--
ALTER TABLE `games`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `progress`
--
ALTER TABLE `progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `games`
--
ALTER TABLE `games`
  ADD CONSTRAINT `games_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `progress`
--
ALTER TABLE `progress`
  ADD CONSTRAINT `progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `progress_ibfk_2` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
