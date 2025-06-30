-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 30 juin 2025 à 15:21
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
-- Structure de la table `activite`
--

CREATE TABLE `activite` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `titre` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `coach_assigne` bigint(20) UNSIGNED DEFAULT NULL,
  `installation_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `adherent`
--

CREATE TABLE `adherent` (
  `id_utilisateur` bigint(20) UNSIGNED NOT NULL,
  `date_naissance` date DEFAULT NULL,
  `genre` varchar(10) DEFAULT NULL,
  `statut_abonnement` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `adherent`
--

INSERT INTO `adherent` (`id_utilisateur`, `date_naissance`, `genre`, `statut_abonnement`) VALUES
(6, '2025-05-09', 'M', 'Active'),
(14, '0000-00-00', 'M', 'Active');

-- --------------------------------------------------------

--
-- Structure de la table `coach`
--

CREATE TABLE `coach` (
  `id_utilisateur` bigint(20) UNSIGNED NOT NULL,
  `specialite` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `creneaux`
--

CREATE TABLE `creneaux` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `date` date DEFAULT NULL,
  `heure_debut` time DEFAULT NULL,
  `heure_fin` time DEFAULT NULL,
  `disponible` varchar(5) DEFAULT NULL,
  `id_installation` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `creneaux`
--

INSERT INTO `creneaux` (`id`, `date`, `heure_debut`, `heure_fin`, `disponible`, `id_installation`) VALUES
(1, '2025-05-21', '09:00:00', '10:00:00', 'oui', 9),
(2, '2025-05-21', '10:00:00', '11:00:00', 'oui', 3),
(4, '2025-05-07', '10:30:00', '18:50:00', 'oui', 9),
(5, '2025-05-22', '18:01:00', '20:01:00', 'oui', 7),
(7, '2025-05-28', '15:00:00', '17:00:00', 'oui', 2),
(8, '2024-07-05', '11:00:00', '13:00:00', 'oui', 9),
(9, '2025-07-06', '12:30:00', '14:00:00', 'oui', 2);

-- --------------------------------------------------------

--
-- Structure de la table `evenement`
--

CREATE TABLE `evenement` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `lieu` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `inscription_evenement`
--

CREATE TABLE `inscription_evenement` (
  `id_utilisateur` int(11) NOT NULL,
  `id_evenement` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `installations`
--

CREATE TABLE `installations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `capacite` int(11) NOT NULL,
  `disponible` varchar(10) NOT NULL,
  `nbr` int(11) NOT NULL,
  `prix_unitaire` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `installations`
--

INSERT INTO `installations` (`id`, `nom`, `type`, `capacite`, `disponible`, `nbr`, `prix_unitaire`) VALUES
(1, 'padel2', 'type1', 9, 'oui', 10, 100),
(2, 'Tennis', 'Tennis', 5, 'oui', 3, 200),
(3, 'Foot', 'Foot', 10, 'oui', 3, 100),
(5, 'Gym', 'Gym', 50, 'non', 0, 0),
(7, 'Spa', 'Spa', 9, 'non', 0, 0),
(8, 'Piscine', 'Piscine', 30, 'non', 0, 0),
(9, 'Basket', 'Basket', 10, 'oui', 9, 300);

-- --------------------------------------------------------

--
-- Structure de la table `participation_activite`
--

CREATE TABLE `participation_activite` (
  `id_utilisateur` bigint(20) UNSIGNED NOT NULL,
  `id_activite` bigint(20) UNSIGNED NOT NULL,
  `date_participation` date DEFAULT NULL,
  `heure_participation` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `reservations`
--

CREATE TABLE `reservations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_utilisateur` bigint(20) UNSIGNED DEFAULT NULL,
  `id_creneau` bigint(20) UNSIGNED DEFAULT NULL,
  `date_jour_reservation` datetime NOT NULL DEFAULT current_timestamp(),
  `nbr_personn` int(11) NOT NULL,
  `statut` varchar(20) DEFAULT 'en attente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `reservations`
--

INSERT INTO `reservations` (`id`, `id_utilisateur`, `id_creneau`, `date_jour_reservation`, `nbr_personn`, `statut`) VALUES
(55, 14, 1, '2025-06-27 12:36:12', 1, 'en attente'),
(56, 14, 1, '2025-06-27 12:38:06', 1, 'en attente'),
(57, 14, 1, '2025-06-27 12:41:05', 1, 'en attente'),
(58, 14, 1, '2025-06-27 15:00:04', 1, 'confirmée'),
(59, 14, 1, '2025-06-27 15:06:08', 1, 'confirmée'),
(60, 14, 4, '2025-06-27 15:13:47', 1, 'en attente'),
(61, 14, 1, '2025-06-30 10:18:29', 1, 'en attente'),
(62, 14, 1, '2025-06-30 10:21:45', 1, 'en attente'),
(63, 14, 4, '2025-06-30 10:22:35', 1, 'confirmée'),
(64, 14, 1, '2025-06-30 10:32:49', 1, 'confirmée'),
(65, 14, 1, '2025-06-30 10:42:41', 1, 'en attente'),
(66, 14, 4, '2025-06-30 10:43:46', 1, 'confirmée');

-- --------------------------------------------------------

--
-- Structure de la table `responsable`
--

CREATE TABLE `responsable` (
  `id_utilisateur` bigint(20) UNSIGNED NOT NULL,
  `departement` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(50) DEFAULT NULL,
  `prenom` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `mot_de_passe` varchar(255) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `date_naissance` date DEFAULT NULL,
  `profesion` varchar(250) NOT NULL,
  `role` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `nom`, `prenom`, `email`, `mot_de_passe`, `telephone`, `date_naissance`, `profesion`, `role`) VALUES
(2, 'ben', 'mahmoud', 'mahmoud@gmail.com', '12345', '0708047370', NULL, '0', 'adherent'),
(3, 'ben', 'mahmoud', 'admin2', 'admin', '0708047370', NULL, '0', 'coach'),
(4, 'coach', 'mahmoud', 'user', '$2b$10$YiI.tTkn8JW3KeKN1L3tteIf5mL70NreNABl9Gh7FSdYEzzteGgtq', '0687987510', NULL, '0', 'coach'),
(5, 'ben', 'mahmoud', 'RTCF', '$2a$12$qzlxdiBTDpeY2aFPRelNX.E1RU6T0W5FNXRyKcV6VQiQWSddGwR6W', '0708047370', NULL, '0', 'responsable'),
(6, 'ben', 'mahmoud', 'adherent', '$2a$12$qzlxdiBTDpeY2aFPRelNX.E1RU6T0W5FNXRyKcV6VQiQWSddGwR6W', '0708047370', NULL, '0', 'adherent'),
(7, 'nom', 'prenom', 'email@gmail.com', '1234', '0648579824', NULL, '0', 'adherent'),
(9, 'mahmoud', 'ben', 'mahmoud454@gmail.com', '$2b$10$xxZBtlv5oEs84vwjhZnQWuvXBX6RxrZ8IK/23d8vOLJX7mnyB6sx6', '0641588782', NULL, '0', 'adherent'),
(10, 'mahmoud', 'benji', 'admin', '$2b$10$6HXuT5pQYY.71YIG/TIk5.AgdCGSisBPdv9/qi1wRWlCyoiWkAJr6', '0647845978', NULL, '0', 'admin'),
(11, 'Benhaykal', 'Douae', 'douae@gmail.com', '$2b$10$6HXuT5pQYY.71YIG/TIk5.AgdCGSisBPdv9/qi1wRWlCyoiWkAJr6', '0614887755', NULL, '0', 'admin'),
(13, 'benha', 'douae', 'douaebenhaikal@gmail.com', '$2b$10$BISjCXqdqr1R5032MgOjA.7IpOttPcej15deY7egL4OlDFKOUXygi', '0545878987', NULL, '0', 'responsable'),
(14, 'Naghach', 'Mouhsine', 'mouhsine@gmail.com', '$2b$10$XpcsXQhpWJ4fVD2rVtT7COIb3ep7FubnEyXiWp00zdzZAHzVSqe6u', '0682666725', NULL, '0', 'admin');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `activite`
--
ALTER TABLE `activite`
  ADD PRIMARY KEY (`id`),
  ADD KEY `coach_assigne` (`coach_assigne`);

--
-- Index pour la table `adherent`
--
ALTER TABLE `adherent`
  ADD PRIMARY KEY (`id_utilisateur`);

--
-- Index pour la table `coach`
--
ALTER TABLE `coach`
  ADD PRIMARY KEY (`id_utilisateur`);

--
-- Index pour la table `creneaux`
--
ALTER TABLE `creneaux`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_installation` (`id_installation`);

--
-- Index pour la table `installations`
--
ALTER TABLE `installations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `participation_activite`
--
ALTER TABLE `participation_activite`
  ADD PRIMARY KEY (`id_utilisateur`,`id_activite`),
  ADD KEY `id_activite` (`id_activite`);

--
-- Index pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_utilisateur` (`id_utilisateur`),
  ADD KEY `id_creneau` (`id_creneau`);

--
-- Index pour la table `responsable`
--
ALTER TABLE `responsable`
  ADD PRIMARY KEY (`id_utilisateur`);

--
-- Index pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `activite`
--
ALTER TABLE `activite`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `creneaux`
--
ALTER TABLE `creneaux`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `installations`
--
ALTER TABLE `installations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `activite`
--
ALTER TABLE `activite`
  ADD CONSTRAINT `activite_ibfk_1` FOREIGN KEY (`coach_assigne`) REFERENCES `coach` (`id_utilisateur`) ON DELETE SET NULL;

--
-- Contraintes pour la table `adherent`
--
ALTER TABLE `adherent`
  ADD CONSTRAINT `adherent_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `coach`
--
ALTER TABLE `coach`
  ADD CONSTRAINT `coach_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `creneaux`
--
ALTER TABLE `creneaux`
  ADD CONSTRAINT `creneaux_ibfk_1` FOREIGN KEY (`id_installation`) REFERENCES `installations` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `participation_activite`
--
ALTER TABLE `participation_activite`
  ADD CONSTRAINT `participation_activite_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `participation_activite_ibfk_2` FOREIGN KEY (`id_activite`) REFERENCES `activite` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`id_creneau`) REFERENCES `creneaux` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `responsable`
--
ALTER TABLE `responsable`
  ADD CONSTRAINT `responsable_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
