const express = require("express");
const router = express.Router();
const db = require("../db"); // Ou ton fichier de connexion
const jwt = require("jsonwebtoken"); // Si vous utilisez un token JWT pour l'authentification

// Exemple de route pour récupérer le profil de l'utilisateur
router.get("/userprofile/:id", async (req, res) => {
  const userId = req.params.id; // Récupérer l'ID de l'URL

  try {
    // Récupérer les informations de l'utilisateur avec ses données associées (adherent, coach, responsable)
    const [userProfile] = await db.execute(
      `
      SELECT 
        u.id,
        u.nom,
        u.prenom,
        u.email,
        u.telephone,
        u.role,
        u.date_naissance,
        u.genre,
        a.statut_abonnement,
        a.date_inscription,
        c.specialite,
        r.departement
      FROM utilisateurs u
      LEFT JOIN adherent a ON u.id = a.id_utilisateur
      LEFT JOIN coach c ON u.id = c.id_utilisateur
      LEFT JOIN responsable r ON u.id = r.id_utilisateur
      WHERE u.id = ?
      `,
      [userId]
    );

    // Vérification si l'utilisateur existe
    if (userProfile.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Renvoyer les données de l'utilisateur
    res.status(200).json(userProfile[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération du profil." });
  }
});

module.exports = router;
