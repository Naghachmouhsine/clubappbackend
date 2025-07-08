const express = require('express');
const router = express.Router();
const pool = require('../db'); // Connexion MySQL

// GET /evenements — liste tous les événements
router.get('/', async (req, res) => {
  console.log('GET /api/evenements');
  try {
    const [rows] = await pool.query('SELECT * FROM evenement ORDER BY date ASC');
    console.log('Événements récupérés:', rows);
    res.json(rows);
  } catch (err) {
    console.error('Erreur GET /evenements:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST /evenements — créer un événement
router.post('/', async (req, res) => {
  const { nom, description, date, lieu } = req.body;
  console.log('POST /api/evenements avec:', req.body);
  try {
    const [result] = await pool.query(
      'INSERT INTO evenement (nom, description, date, lieu) VALUES (?, ?, ?, ?)',
      [nom, description, date, lieu]
    );
    const [created] = await pool.query('SELECT * FROM evenement WHERE id = ?', [result.insertId]);
    console.log('Événement créé:', created[0]);
    res.status(201).json(created[0]);
  } catch (err) {
    console.error('Erreur POST /evenements:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /evenements/:id — modifier un événement
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, description, date, lieu } = req.body;
  console.log(`PUT /api/evenements/${id} avec:`, req.body);
  try {
    await pool.query(
      'UPDATE evenement SET nom = ?, description = ?, date = ?, lieu = ? WHERE id = ?',
      [nom, description, date, lieu, id]
    );
    const [updated] = await pool.query('SELECT * FROM evenement WHERE id = ?', [id]);
    console.log('Événement modifié:', updated[0]);
    res.json(updated[0]);
  } catch (err) {
    console.error(`Erreur PUT /evenements/${id}:`, err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// DELETE /evenements/:id — supprimer un événement
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`DELETE /api/evenements/${id}`);
  try {
    await pool.query('DELETE FROM evenement WHERE id = ?', [id]);
    console.log(`Événement ${id} supprimé`);
    res.json({ message: 'Événement supprimé' });
  } catch (err) {
    console.error(`Erreur DELETE /evenements/${id}:`, err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
