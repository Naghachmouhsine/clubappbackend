-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 07 juil. 2025 à 18:06
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
  `date_inscription` varchar(30) NOT NULL,
  `typeReinscription` varchar(20) NOT NULL,
  `statut_abonnement` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `adherent`
--

INSERT INTO `adherent` (`id_utilisateur`, `date_inscription`, `typeReinscription`, `statut_abonnement`) VALUES
(2, '07/07/2025', 'Senior seul', 'Active'),
(6, '08/20/2024', 'Couple senior', 'Active'),
(7, '01/07/2024', 'Étudiant', 'inActive'),
(9, '07/29/2024', 'Étudiant', 'Active'),
(15, '07/07/2025', 'Senior seul', 'Active');

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
  `date` varchar(40) NOT NULL,
  `heure_debut` time DEFAULT NULL,
  `heure_fin` time DEFAULT NULL,
  `disponible` varchar(5) DEFAULT NULL,
  `id_installation` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `creneaux`
--

INSERT INTO `creneaux` (`id`, `date`, `heure_debut`, `heure_fin`, `disponible`, `id_installation`) VALUES
(1, '2025-05-21', '09:00:00', '10:00:00', 'non', 9),
(2, '2025-05-21', '10:00:00', '11:00:00', 'oui', 3),
(4, '2025-05-07', '10:30:00', '18:50:00', 'non', 9),
(5, '2025-05-22', '18:01:00', '20:01:00', 'oui', 7),
(7, '2025-05-28', '15:00:00', '17:00:00', 'non', 2),
(8, '2024-07-05', '11:00:00', '13:00:00', 'non', 9),
(9, '2025-07-06', '12:30:00', '14:00:00', 'non', 2),
(10, '2025-07-08', '12:00:00', '14:00:00', 'oui', 8),
(11, '2025-07-04', '12:00:00', '13:00:00', 'non', 1);

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
-- Structure de la table `inscription_annuelle`
--

CREATE TABLE `inscription_annuelle` (
  `id_adherant` bigint(20) UNSIGNED NOT NULL,
  `date_inscription` varchar(30) NOT NULL,
  `status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `inscription_annuelle`
--

INSERT INTO `inscription_annuelle` (`id_adherant`, `date_inscription`, `status`) VALUES
(2, '02/07/2024', 'inactife'),
(6, '20/08/2024', 'actif'),
(7, '01/07/2024', 'inactife'),
(9, '29/07/2024', 'actif'),
(15, '06/07/2024', 'inactife');

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
(1, 'padel', 'padel', 4, 'oui', 4, 100),
(2, 'Tennis', 'Tennis', 5, 'oui', 9, 200),
(3, 'Foot', 'Foot', 10, 'oui', 3, 100),
(5, 'Gym', 'Gym', 50, 'non', 0, 0),
(7, 'Spa', 'Spa', 9, 'non', 0, 0),
(8, 'Piscine', 'Piscine', 30, 'oui', 3, 0),
(9, 'Basket', 'Basket', 10, 'oui', 0, 300);

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
-- Structure de la table `pointsfidelite`
--

CREATE TABLE `pointsfidelite` (
  `id_adherant` bigint(20) UNSIGNED NOT NULL,
  `points` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `pointsfidelite`
--

INSERT INTO `pointsfidelite` (`id_adherant`, `points`) VALUES
(2, 12),
(9, 5),
(15, 55);

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
(66, 14, 4, '2025-06-30 10:43:46', 1, 'confirmée'),
(67, 14, 1, '2025-06-30 15:40:13', 1, 'confirmée'),
(68, 14, 4, '2025-06-30 15:53:00', 1, 'confirmée'),
(69, 14, 8, '2025-06-30 17:07:18', 1, 'en attente'),
(70, 14, 1, '2025-06-30 17:08:30', 1, 'en attente'),
(71, 14, 1, '2025-06-30 17:11:02', 1, 'en attente'),
(72, 14, 10, '2025-06-30 17:23:27', 1, 'en attente'),
(73, 14, 7, '2025-07-02 20:16:27', 1, 'confirmée'),
(74, 14, 9, '2025-07-02 20:18:43', 1, 'en attente'),
(75, 14, 1, '2025-07-02 20:27:36', 1, 'confirmée'),
(76, 14, 4, '2025-07-02 20:28:52', 1, 'confirmée'),
(77, 14, 1, '2025-07-02 20:50:45', 1, 'confirmée'),
(78, 14, 11, '2025-07-03 14:59:50', 1, 'en attente'),
(79, 14, 11, '2025-07-03 15:01:27', 1, 'en attente'),
(80, 14, 11, '2025-07-03 15:03:21', 2, 'en attente'),
(81, 14, 11, '2025-07-03 15:13:22', 4, 'confirmée'),
(82, 14, 4, '2025-07-03 15:48:31', 1, 'confirmée'),
(83, 14, 9, '2025-07-03 17:26:58', 1, 'en attente'),
(87, 14, 11, '2025-07-07 15:38:44', 1, 'en attente'),
(88, 15, 11, '2025-07-07 15:42:56', 1, 'en attente'),
(89, 15, 7, '2025-07-07 15:44:06', 1, 'en attente');

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
  `role` varchar(20) DEFAULT NULL,
  `genre` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `nom`, `prenom`, `email`, `mot_de_passe`, `telephone`, `date_naissance`, `profesion`, `role`, `genre`) VALUES
(2, 'ben', 'mahmoud', 'mahmoud@gmail.com', '12345', '0708047370', '1992-04-15', 'étudiant', 'adherent', 'masculin'),
(3, 'ben', 'mahmoud', 'admin2', 'admin', '0708047370', '1985-11-03', 'enfant', 'coach', 'masculin'),
(4, 'coach', 'mahmoud', 'user', '$2b$10$YiI.tTkn8JW3KeKN1L3tteIf5mL70NreNABl9Gh7FSdYEzzteGgtq', '0687987510', '1978-07-22', 'ingénieur', 'coach', 'masculin'),
(5, 'ben', 'mahmoud', 'RTCF', '$2a$12$qzlxdiBTDpeY2aFPRelNX.E1RU6T0W5FNXRyKcV6VQiQWSddGwR6W', '0708047370', '2001-01-09', 'médecin', 'responsable', 'masculin'),
(6, 'ben', 'mahmoud', 'adherent', '$2a$12$qzlxdiBTDpeY2aFPRelNX.E1RU6T0W5FNXRyKcV6VQiQWSddGwR6W', '0708047370', '1995-06-30', 'enseignant', 'adherent', 'masculin'),
(7, 'nom', 'prenom', 'email@gmail.com', '1234', '0648579824', '1988-03-17', 'commerçant', 'adherent', 'masculin'),
(9, 'mahmoud', 'ben', 'mahmoud454@gmail.com', '$2b$10$xxZBtlv5oEs84vwjhZnQWuvXBX6RxrZ8IK/23d8vOLJX7mnyB6sx6', '0641588782', '1972-08-12', 'artiste', 'adherent', 'masculin'),
(10, 'mahmoud', 'benji', 'admin', '$2b$10$6HXuT5pQYY.71YIG/TIk5.AgdCGSisBPdv9/qi1wRWlCyoiWkAJr6', '0647845978', '2000-02-25', 'étudiant', 'admin', 'masculin'),
(11, 'Benhaykal', 'Douae', 'douae@gmail.com', '$2b$10$6HXuT5pQYY.71YIG/TIk5.AgdCGSisBPdv9/qi1wRWlCyoiWkAJr6', '0614887755', '1993-10-05', 'enfant', 'admin', 'masculin'),
(13, 'benha', 'douae', 'douaebenhaikal@gmail.com', '$2b$10$BISjCXqdqr1R5032MgOjA.7IpOttPcej15deY7egL4OlDFKOUXygi', '0545878987', '1976-12-14', 'technicien', 'responsable', 'feminin'),
(14, 'Naghach', 'Mouhsine', 'mouhsine@gmail.com', '$2b$10$XpcsXQhpWJ4fVD2rVtT7COIb3ep7FubnEyXiWp00zdzZAHzVSqe6u', '0682666725', '1989-05-06', 'ouvrier', 'admin', 'masculin'),
(15, 'Naghach', 'Mouhsine', 'mouhsine.naghach@usmba.ac.ma', '$2a$10$hy4HpI3.ymo5Z.v0g4oOaOnmFHOjlAKruqsI6C3nf.a4dfsyP2IDW', '0681666725', '1998-07-19', 'ingénieur', 'adherent', 'masculin');

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
-- Index pour la table `inscription_annuelle`
--
ALTER TABLE `inscription_annuelle`
  ADD PRIMARY KEY (`id_adherant`);

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
-- Index pour la table `pointsfidelite`
--
ALTER TABLE `pointsfidelite`
  ADD PRIMARY KEY (`id_adherant`);

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
-- Index pour la table `tarifs`
--
ALTER TABLE `tarifs`
  ADD KEY `fk_intallation` (`installation_id`);

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `inscription_annuelle`
--
ALTER TABLE `inscription_annuelle`
  MODIFY `id_adherant` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `installations`
--
ALTER TABLE `installations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `pointsfidelite`
--
ALTER TABLE `pointsfidelite`
  MODIFY `id_adherant` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

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
-- Contraintes pour la table `inscription_annuelle`
--
ALTER TABLE `inscription_annuelle`
  ADD CONSTRAINT `fk_utilisateurs_adherant` FOREIGN KEY (`id_adherant`) REFERENCES `utilisateurs` (`id`);

--
-- Contraintes pour la table `participation_activite`
--
ALTER TABLE `participation_activite`
  ADD CONSTRAINT `participation_activite_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `participation_activite_ibfk_2` FOREIGN KEY (`id_activite`) REFERENCES `activite` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `pointsfidelite`
--
ALTER TABLE `pointsfidelite`
  ADD CONSTRAINT `fk_utilisateurs_points` FOREIGN KEY (`id_adherant`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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

--
-- Contraintes pour la table `tarifs`
--
ALTER TABLE `tarifs`
  ADD CONSTRAINT `fk_intallation` FOREIGN KEY (`installation_id`) REFERENCES `installations` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
