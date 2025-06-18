const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ POST : Ajouter une installation
router.post('/installations', async (req, res) => {
  const { nom, type, capacite, disponible } = req.body;

  if (!nom || !type || capacite === undefined || !['oui', 'non'].includes(disponible)) {
    return res.status(400).json({ message: 'Données invalides' });
  }

  try {
    const [existing] = await db.execute("SELECT * FROM installations WHERE nom = ?", [nom]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Une installation avec ce nom existe déjà." });
    }

    await db.execute(
      "INSERT INTO installations (nom, type, capacite, disponible) VALUES (?, ?, ?, ?)",
      [nom, type, capacite, disponible]
    );

    res.status(201).json({ message: "Installation ajoutée avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'installation :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ GET : Liste des installations
router.get('/installations', async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM installations");
    res.json(rows);
  } catch (error) {
    console.error("Erreur lors du fetch des installations :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ GET : Détail d'une installation
router.get('/installations/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const [rows] = await db.execute("SELECT * FROM installations WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Installation non trouvée" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Erreur lors du fetch de l'installation :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ PUT : Modifier une installation
router.put('/installations/:id', async (req, res) => {
  const id = req.params.id;
  const { nom, type, capacite, disponible } = req.body;

  try {
    const query = `
      UPDATE installations 
      SET nom = ?, type = ?, capacite = ?, disponible = ?
      WHERE id = ?
    `;
    const [result] = await db.execute(query, [nom, type, capacite, disponible, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Installation non trouvée" });
    }

    res.json({ message: "Installation mise à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'installation :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ DELETE : Supprimer une installation
router.delete('/installations/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const [result] = await db.execute("DELETE FROM installations WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Installation non trouvée" });
    }

    res.json({ message: "Installation supprimée" });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
