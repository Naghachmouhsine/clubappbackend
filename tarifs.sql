-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 03 juil. 2025 à 18:46
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `clubapprtcf`
--

-- --------------------------------------------------------

--
-- Structure de la table `tarifs`
--

CREATE TABLE `tarifs` (
  `installation_id` bigint(11) UNSIGNED NOT NULL,
  `tarif` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`tarif`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `tarifs`
--

INSERT INTO `tarifs` (`installation_id`, `tarif`) VALUES
(1, '{\r\n    \"adherents\": {\r\n      \"matin\": {\r\n        \"prix_total\": \"220\",\r\n        \"prix_par_personne\": \"55\"\r\n      },\r\n      \"soir_weekend_feries\": {\r\n        \"prix_total\": \"280\",\r\n        \"prix_par_personne\": \"70\"\r\n      }\r\n    },\r\n    \"non_adherents\": {\r\n      \"matin\": {\r\n        \"prix_total\": \"300\",\r\n        \"prix_par_personne\": \"75\"\r\n      },\r\n      \"soir_weekend_feries\": {\r\n        \"prix_total\": \"340\",\r\n        \"prix_par_personne\": \"85\"\r\n      }\r\n    },\r\n    \"location_raquette\": \"30\"\r\n}'),
(2, '{\r\n    \"sans_coach\": 100,\r\n    \"avec_coach\": 100\r\n}'),
(8, '{\r\n      \"semaine\": 150,\r\n      \"weekend_et_feries\": 200 \r\n}\r\n');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `tarifs`
--
ALTER TABLE `tarifs`
  ADD KEY `fk_intallation` (`installation_id`);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `tarifs`
--
ALTER TABLE `tarifs`
  ADD CONSTRAINT `fk_intallation` FOREIGN KEY (`installation_id`) REFERENCES `installations` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
