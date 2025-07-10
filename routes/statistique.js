const express = require('express');
const router = express.Router();
const pool = require('../db');


router.get('/totaleReservation', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(id) as nbrTotale FROM `reservations`');
    res.json(rows[0]);
  } catch (err) {
    console.error('Erreur GET:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/totaleAdherent', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(id_utilisateur) as nbrAdherent FROM `adherent`');

    res.json(rows[0]);
  } catch (err) {
    console.error('Erreur GET:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/totaleParticipationEvenement', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(id_utilisateur) as nbrParticipationEvenement FROM inscription_evenement;');
    console.log("good",rows)
    res.json(rows[0]);
  } catch (err) {
    console.error('Erreur GET:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/totaleParticipationActivite', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(id_utilisateur) as nbrParticipationActivte FROM participation_activite;');
    console.log("good",rows)
    res.json(rows[0]);
  } catch (err) {
    console.error('Erreur GET:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/reservationsParMois', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        MONTH(date_jour_reservation) AS mois,
        COUNT(*) AS nombre
      FROM 
        reservations
      GROUP BY 
        MONTH(date_jour_reservation)
      ORDER BY 
        mois
    `);

    // Générer un tableau de 12 mois avec 0 par défaut
    const result = Array(12).fill(0);
    rows.forEach(row => {
      result[row.mois - 1] = row.nombre;
    });

    res.json({
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
      data: result,
    });

  } catch (err) {
    console.error('Erreur API réservation par mois :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/statutsReservations', async (req, res) => {
  try {
    // Récupérer les totaux par statut
    const [rows] = await pool.execute(`
      SELECT statut, COUNT(*) as total
      FROM reservations
      GROUP BY statut
    `);

    // Récupérer le nombre total de réservations
    const [rowsTotal] = await pool.execute(`
      SELECT COUNT(id) as nbrTotale FROM reservations
    `);

    const total = rowsTotal[0]?.nbrTotale || 1; // éviter division par 0

    // Statuts attendus dans l'ordre voulu
    const statuts = ['confirmée', 'en attente', 'annulée'];

    // Initialiser les pourcentages à 0
    const counts = {
      'confirmée': 0,
      'en attente': 0,
      'annulée': 0
    };

    // Remplir les données réelles en pourcentage
    rows.forEach(row => {
      const statut = row.statut?.toLowerCase().trim();
      if (counts.hasOwnProperty(statut)) {
        counts[statut] = parseFloat(((row.total / total) * 100).toFixed(2)); // % arrondi
      }
    });

    const labels = statuts;
    const data = statuts.map(s => counts[s]);

    res.json({ labels, data });

  } catch (error) {
    console.error('Erreur lors de la récupération des statuts :', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


module.exports=router