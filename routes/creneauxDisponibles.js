// routes/creneauxDisponibles.js
const express = require('express');
const router = express.Router();
const connection = require('../db'); // adapte le chemin à ton projet

router.get('/api/creneaux-disponibles', (req, res) => {
  const { activite, date } = req.query;

  if (!activite || !date) {
    return res.status(400).json({ error: 'Paramètres "activite" et "date" requis' });
  }

  const sql = `
   SELECT c.id,c.date,c.heure_debut,c.heure_fin
    FROM creneaux as c, installations as i
    WHERE c.date=?
    AND c.disponible="oui"
    AND c.id_installation=i.id
    AND i.type=?
    AND i.disponible="oui";
  `;

  connection.query(sql, [date,activite], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des créneaux :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    res.json(results);
  });
});

module.exports = router;
