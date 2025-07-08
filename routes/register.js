const express = require("express");
const router = express.Router();
const db = require("../db"); // ou ton fichier de connexion
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Exemple de route register
router.post("/register", async (req, res) => {
  const { nom, prenom, email, password, telephone } = req.body;
  
  // Vérification des champs obligatoires
  if (!nom || !prenom || !email || !password || !telephone) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  // Vérification du format de l'email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Format d'email invalide." });
  }


  try {
    const [existing] = await db.execute("SELECT * FROM utilisateurs WHERE email = ?", [email.toLowerCase()]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      "INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, telephone, role) VALUES (?, ?, ?, ?, ?, 'user')",
      [nom, prenom, email.toLowerCase(), hashedPassword, telephone]
    );

    res.status(201).json({ message: "Inscription réussie." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

module.exports = router;