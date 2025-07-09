const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');

// Configuration de multer pour l'upload des images
const storage = multer.diskStorage({
  destination: 'uploads/', // dossier où enregistrer les fichiers
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// 🟢 GET /evenements — liste tous les événements
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

// 🟢 POST /evenements — créer un événement avec image (facultative)
router.post('/', upload.single('image'), async (req, res) => {
  const { nom, description, date, lieu } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  console.log('POST /api/evenements avec:', { nom, description, date, lieu, image_url });

  try {
    const [result] = await pool.query(
      'INSERT INTO evenement (nom, description, date, lieu, image_url) VALUES (?, ?, ?, ?, ?)',
      [nom, description, date, lieu, image_url]
    );
    const [created] = await pool.query('SELECT * FROM evenement WHERE id = ?', [result.insertId]);
    console.log('Événement créé:', created[0]);
    res.status(201).json(created[0]);
  } catch (err) {
    console.error('Erreur POST /evenements:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 🟡 PUT /evenements/:id — modifier un événement (avec ou sans nouvelle image)
router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { nom, description, date, lieu } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  console.log(`PUT /api/evenements/${id} avec:`, { nom, description, date, lieu, image_url });

  try {
    let query = 'UPDATE evenement SET nom = ?, description = ?, date = ?, lieu = ?';
    const params = [nom, description, date, lieu];

    if (image_url) {
      query += ', image_url = ?';
      params.push(image_url);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await pool.query(query, params);

    const [updated] = await pool.query('SELECT * FROM evenement WHERE id = ?', [id]);
    console.log('Événement modifié:', updated[0]);
    res.json(updated[0]);
  } catch (err) {
    console.error(`Erreur PUT /evenements/${id}:`, err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 🔴 DELETE /evenements/:id — supprimer un événement
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
