const express = require('express');
const router = express.Router();
const db = require('../db');

// POST : Ajouter une date (créneau à réserver)
router.post('/dates', async (req, res) => {
  const { date, disponible } = req.body;

  if (!date || !['oui', 'non'].includes(disponible)) {
    return res.status(400).json({ message: 'Données invalides' });
  }

  try {
    // Vérifier si la date existe déjà
    const [existing] = await db.execute("SELECT * FROM dates WHERE date = ?", [date]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Cette date est déjà enregistrée." });
    }

    // Insérer la date
    await db.execute(
      "INSERT INTO dates (date, disponible) VALUES (?, ?)",
      [date, disponible]
    );

    res.status(201).json({ message: "Date ajoutée avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la date :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET : Liste des dates
router.get('/dates', async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM dates");
    res.json(rows);
  } catch (error) {
    console.error("Erreur lors du fetch des dates :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET : Détail d'une date
router.get('/dates/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const [rows] = await db.execute("SELECT * FROM dates WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Date non trouvée" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Erreur lors du fetch de la date :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PUT : Modifier une date
router.put('/dates/:id', async (req, res) => {
  const id = req.params.id;
  const { date, disponible } = req.body;

  if (!date || !['oui', 'non'].includes(disponible)) {
    return res.status(400).json({ message: 'Données invalides' });
  }

  try {
    const query = `
      UPDATE dates 
      SET date = ?, disponible = ?
      WHERE id = ?
    `;
    const [result] = await db.execute(query, [date, disponible, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Date non trouvée" });
    }

    res.json({ message: "Date mise à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la date :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE : Supprimer une date
router.delete('/dates/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const [result] = await db.execute("DELETE FROM dates WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Date non trouvée" });
    }

    res.json({ message: "Date supprimée" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la date :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
