const express = require('express');
const router = express.Router();
const pool = require('../db'); // Connexion MySQL
const { getPoints } = require("../services/calculePointsFildalites")


async function adherantsParticiper(id_adherant,id_evenement){ // pour verfier adhernent est participer ou non 
  try {
    const [rows] = await pool.query('SELECT * FROM inscription_evenement WHERE id_utilisateur=? AND id_evenement=? ',[id_adherant,id_evenement]);
    return rows.length!=0
  } catch (err) {
    return false
  }
}

// GET /evenements — liste tous les événements
router.get('/', async (req, res) => {
  console.log('GET /api/evenements');
  try {
    const [rows] = await pool.query('SELECT * FROM evenement ORDER BY date ASC');
    // console.log('Événements récupérés:', rows);
    res.json(rows);
  } catch (err) {
    console.error('Erreur GET /evenements:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// // 🟢 POST /evenements — créer un événement avec image (facultative)
// router.post('/', upload.single('image'), async (req, res) => {
//   const { nom, description, date, lieu } = req.body;
//   const image_url = req.file ? `/uploads/${req.file.filename}` : null;

//   console.log('POST /api/evenements avec:', { nom, description, date, lieu, image_url });

//   try {
//     const [result] = await pool.query(
//       'INSERT INTO evenement (nom, description, date, lieu, image_url) VALUES (?, ?, ?, ?, ?)',
//       [nom, description, date, lieu, image_url]
//     );
//     const [created] = await pool.query('SELECT * FROM evenement WHERE id = ?', [result.insertId]);
//     console.log('Événement créé:', created[0]);
//     res.status(201).json(created[0]);
//   } catch (err) {
//     console.error('Erreur POST /evenements:', err.message);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// });

// 🟡 PUT /evenements/:id — modifier un événement (avec ou sans nouvelle image)
// router.put('/:id', upload.single('image'), async (req, res) => {
//   const { id } = req.params;
//   const { nom, description, date, lieu } = req.body;
//   const image_url = req.file ? `/uploads/${req.file.filename}` : null;

//   console.log(`PUT /api/evenements/${id} avec:`, { nom, description, date, lieu, image_url });

//   try {
//     let query = 'UPDATE evenement SET nom = ?, description = ?, date = ?, lieu = ?';
//     const params = [nom, description, date, lieu];

//     if (image_url) {
//       query += ', image_url = ?';
//       params.push(image_url);
//     }

//     query += ' WHERE id = ?';
//     params.push(id);

//     await pool.query(query, params);

//     const [updated] = await pool.query('SELECT * FROM evenement WHERE id = ?', [id]);
//     console.log('Événement modifié:', updated[0]);
//     res.json(updated[0]);
//   } catch (err) {
//     console.error(`Erreur PUT /evenements/${id}:`, err.message);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// });

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


router.post('/participer', async (req, res) => {
    const { idAdherant, idEvenement } = req.body;
    const isParticiper=await adherantsParticiper(idAdherant,idEvenement)
    if(isParticiper)// adherant deja participer
       res.json({ isParticiper:isParticiper,message: "vous etes deja participer dans cet evenement" });
    else{
    const connection = await pool.getConnection();
    const pointAdheran = await getPoints(idAdherant)
    const pointsModifer = pointAdheran!=undefined ? pointAdheran.points + 10 : 10
    try {
        await connection.beginTransaction();

        // ajoute recempense dans la table
        await connection.execute(
            `INSERT INTO inscription_evenement (id_utilisateur, id_evenement) VALUES (?,?)`,
            [idAdherant, idEvenement]
        );

        await connection.execute(
            ` INSERT INTO pointsfidelite (id_adherant, points)
               VALUES (?, ?)
               ON DUPLICATE KEY UPDATE points = ?`,
            [idAdherant,pointsModifer,pointsModifer]
        );

        await connection.commit();
        res.json({totalPoints:pointsModifer ,message: "La participation est réussie" });

    } catch (error) {
        console.error("Erreur lors de la réinscription :", error);
        if (connection) await connection.rollback();
        res.status(500).json({ message: "Erreur serveur pendant l'ajoute recempnse." });
    } finally {
        if (connection) connection.release();
    }
    }
});

router.get('/getParticipation/:id', async (req, res) => {
  const idAdherant=req.params.id
  console.log(idAdherant)
  try {
    const [rows] = await pool.query(`SELECT evenement.*,inscription_evenement.id_utilisateur
                                      FROM evenement,inscription_evenement
                                      WHERE inscription_evenement.id_evenement=evenement.id
                                      AND inscription_evenement.id_utilisateur= ?;`,[idAdherant]);
    console.log('Événements récupérés:', rows);
    res.json(rows);
  } catch (err) {
    console.error('Erreur GET /evenements:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


module.exports = router;
