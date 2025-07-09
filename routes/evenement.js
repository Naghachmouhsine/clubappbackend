const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const { getPoints } = require("../services/calculePointsFildalites");

// 🔧 Configuration de multer pour l'upload des images
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// 🟢 GET /evenements — liste tous les événements
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM evenement ORDER BY date ASC');
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

  try {
    const [result] = await pool.query(
      'INSERT INTO evenement (nom, description, date, lieu, image_url) VALUES (?, ?, ?, ?, ?)',
      [nom, description, date, lieu, image_url]
    );
    const [created] = await pool.query('SELECT * FROM evenement WHERE id = ?', [result.insertId]);
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
    res.json(updated[0]);
  } catch (err) {
    console.error(`Erreur PUT /evenements/${id}:`, err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 🔴 DELETE /evenements/:id — supprimer un événement
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM evenement WHERE id = ?', [id]);
    res.json({ message: 'Événement supprimé' });
  } catch (err) {
    console.error(`Erreur DELETE /evenements/${id}:`, err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 🟢 POST /evenements/participer — inscrire un adhérent à un événement + ajouter 10 points
router.post('/participer', async (req, res) => {
  const { idAdherant, idEvenement } = req.body;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const pointAdheran = await getPoints(idAdherant);
    const pointsModifer = pointAdheran.points + 10;

    await connection.execute(
      `INSERT INTO inscription_evenement (id_utilisateur, id_evenement) VALUES (?, ?)`,
      [idAdherant, idEvenement]
    );

    await connection.execute(
      `UPDATE pointsfidelite SET points = ? WHERE id_adherant = ?`,
      [pointsModifer, idAdherant]
    );

    await connection.commit();
    res.json({ message: "La participation est réussie" });
  } catch (error) {
    console.error("Erreur lors de la participation :", error);
    if (connection) await connection.rollback();
    res.status(500).json({ message: "Erreur serveur pendant la participation." });
  } finally {
    if (connection) connection.release();
  }
});

// 🟢 GET /evenements/getParticipation/:id — récupère les événements auxquels un adhérent a participé
router.get('/getParticipation/:id', async (req, res) => {
  const idAdherant = req.params.id;
  try {
    const [rows] = await pool.query(
      `SELECT evenement.*, inscription_evenement.id_utilisateur
       FROM evenement
       JOIN inscription_evenement ON inscription_evenement.id_evenement = evenement.id
       WHERE inscription_evenement.id_utilisateur = ?`,
      [idAdherant]
    );
    res.json(rows);
  } catch (err) {
    console.error('Erreur GET /evenements/getParticipation:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
