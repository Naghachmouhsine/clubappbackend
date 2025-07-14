const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require("bcryptjs");
const { genererMotDePasse } = require('../script');

// ✅ POST : Ajouter un utilisateur
router.post('/utilisateurs', async (req, res) => {
  const { nom, prenom, email, telephone, role } = req.body;

  console.log("🟡 Données reçues :", req.body);

  try {
    const [existing] = await db.execute("SELECT * FROM utilisateurs WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà." });
    }

    password = genererMotDePasse(nom,prenom);
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      "INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, telephone, role) VALUES (?, ?, ?, ?, ?,?)",
      [nom, prenom, email.toLowerCase(), hashedPassword, telephone,role]
    );

    res.status(201).json({ message: "Utilisateur ajouté avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ GET : Liste des utilisateurs
router.get('/utilisateurs', async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT `id`, `nom`, `prenom`, `email`, `telephone`, `date_naissance`, `profesion`, `role` FROM `utilisateurs`");
    res.json(rows);
  } catch (error) {
    console.error("Erreur lors du fetch des utilisateurs :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ GET : Détail d'un utilisateur
router.get('/utilisateurs/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const [rows] = await db.execute("SELECT * FROM utilisateurs WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Erreur lors du fetch de l'utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
// ✅ PUT : Modifier un utilisateur
router.put('/utilisateurs/:id', async (req, res) => {
  const id = req.params.id;
  const { nom, prenom, telephone, profesion,date_naissance } = req.body;

  try {
    const query = `
      UPDATE utilisateurs 
      SET nom = ?, prenom = ?, telephone = ?,profesion=?,date_naissance=?
      WHERE id = ?
    `;
    const [result] = await db.execute(query, [nom, prenom, telephone, profesion,date_naissance,id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ message: "Utilisateur mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.put('/updateRoleUser', async (req, res) => {
  const { id,newRole } = req.body;
  
  try {
    const query = `
      UPDATE utilisateurs 
      SET role = ?
      WHERE id = ?
    `;

    const [result] = await db.execute(query, [newRole, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ message: "Utilisateur mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ DELETE : Supprimer un utilisateur par ID
router.delete('/utilisateurs/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const [result] = await db.execute("DELETE FROM utilisateurs WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ message: "Utilisateur supprimé" });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
