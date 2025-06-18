// routes/activites.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Liste des activités
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, nom, emoji, image FROM activites');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Dates disponibles pour une activité
router.get('/:id/dates', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute(
      `SELECT DISTINCT date 
       FROM disponibilites 
       WHERE activite_id = ? AND disponible = 'oui' 
       ORDER BY date ASC`, 
      [id]
    );
    res.json(rows.map(r => r.date));
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Créneaux disponibles pour une activité + date
router.get('/:id/dates/:date/creneaux', async (req, res) => {
  const { id, date } = req.params;
  try {
    const [rows] = await db.execute(
      `SELECT c.id, c.heure_debut, c.heure_fin 
       FROM creneaux c
       JOIN disponibilites d ON d.creneau_id = c.id
       WHERE d.activite_id = ? AND d.date = ? AND d.disponible = 'oui'`, 
      [id, date]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Réserver un créneau
router.post('/reservations', async (req, res) => {
  const { utilisateurId, activiteId, date, creneauId, options } = req.body;
  try {
    // Vérifier si le créneau est dispo
    const [dispo] = await db.execute(
      `SELECT * FROM disponibilites WHERE activite_id = ? AND date = ? AND creneau_id = ? AND disponible = 'oui'`, 
      [activiteId, date, creneauId]
    );
    if (dispo.length === 0) {
      return res.status(400).json({ message: 'Créneau non disponible' });
    }
    // Insérer la réservation
    await db.execute(
      `INSERT INTO reservations (utilisateur_id, activite_id, date, creneau_id, options) VALUES (?, ?, ?, ?, ?)`,
      [utilisateurId, activiteId, date, creneauId, JSON.stringify(options || {})]
    );
    // Optionnel : marquer le créneau comme non dispo (selon ta logique)
    await db.execute(
      `UPDATE disponibilites SET disponible = 'non' WHERE activite_id = ? AND date = ? AND creneau_id = ?`,
      [activiteId, date, creneauId]
    );

    res.status(201).json({ message: 'Réservation enregistrée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
