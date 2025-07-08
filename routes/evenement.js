const express = require('express');
const router = express.Router();
const pool = require('../db'); // Connexion MySQL
const { getPoints } = require("../services/calculePointsFildalites")
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


router.post('/participer', async (req, res) => {
    const { idAdherant, idEvenement } = req.body;
    const connection = await pool.getConnection();
    const pointAdheran = await getPoints(idAdherant)
    const pointsModifer = pointAdheran.points + 10
    try {

        await connection.beginTransaction();

        // ajoute recempense dans la table
        await connection.execute(
            `INSERT INTO inscription_evenement (id_utilisateur, id_evenement) VALUES (?,?)`,
            [idAdherant, idEvenement]
        );

        await connection.execute(
            `UPDATE pointsfidelite 
             SET points = ? 
             WHERE id_adherant = ?`,
            [pointsModifer, idAdherant]
        );

        await connection.commit();
        res.json({ message: "La participation est réussie" });

    } catch (error) {
        console.error("Erreur lors de la réinscription :", error);
        if (connection) await connection.rollback();
        res.status(500).json({ message: "Erreur serveur pendant l'ajoute recempnse." });
    } finally {
        if (connection) connection.release();
    }
});

router.get('/getParticipation/:id', async (req, res) => {
  const idAdherant=req.params.id
  try {
    const [rows] = await pool.query(`SELECT evenement.*,inscription_evenement.id_utilisateur
                                      FROM evenement,inscription_evenement
                                      WHERE inscription_evenement.id_evenement=evenement.id`);
    console.log('Événements récupérés:', rows);
    res.json(rows);
  } catch (err) {
    console.error('Erreur GET /evenements:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


module.exports = router;
