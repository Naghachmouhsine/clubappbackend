// routes/activites.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Liste des activités
router.get('/getAllActivite/:id', async (req, res) => {
  const idCoach = req.params.id
  let rows
  try {
    if (idCoach == 0) { // tout les activites pour admin
      [rows] = await db.execute(`SELECT activite.*, utilisateurs.nom,utilisateurs.prenom,installations.nom  as installation
                                      FROM activite, coach, utilisateurs, installations
                                      WHERE activite.coach_assigne=coach.id_utilisateur
                                      AND coach.id_utilisateur=utilisateurs.id
                                      AND activite.installation_id=installations.id`);
    } else {
      [rows] = await db.execute(`SELECT activite.id,activite.titre,activite.description,activite.type,installations.nom  as installation
                                      FROM activite,installations
                                      WHERE activite.installation_id=installations.id
                                      AND activite.coach_assigne=?`, [idCoach]);
    }

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
router.get('/getParticipationActivite/:id', async (req, res) => {
  const idAdherant = req.params.id
  let rows
  try {

      [rows] = await db.execute(`SELECT 
                                      a.id,
                                      a.titre,
                                      a.description,
                                      a.type,
                                      pa.date_participation,
                                      pa.heure_participation,
                                      i.nom AS installation,
                                      u.nom,
                                      u.prenom
                                    FROM participation_activite pa
                                    JOIN activite a ON pa.id_activite = a.id
                                    JOIN installations i ON a.installation_id = i.id
                                    JOIN coach c ON a.coach_assigne = c.id_utilisateur
                                    JOIN utilisateurs u ON c.id_utilisateur = u.id
                                    WHERE pa.id_utilisateur = 14;
                                `, [idAdherant]);
    

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
router.get('/coaches', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT u.id,u.nom,u.prenom,c.specialite FROM coach c,utilisateurs u WHERE u.id=c.id_utilisateur');
    console.log(rows)
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
router.get('/installation', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id,nom FROM installations');
    console.log(rows)
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
router.post('/activite', async (req, res) => {
  const { titre, description, type, coach_assigne, installation } = req.body;

  try {
    const [result] = await db.execute(
      'INSERT INTO `activite`( `titre`, `description`, `type`, `coach_assigne`, `installation_id`)  VALUES (?, ?, ?, ?, ?)',
      [titre, description, type, coach_assigne, installation]
    );
    res.status(201).json({ message: "Créneau ajouté avec succès", id: result.insertId });
  } catch (error) {
    console.error("Erreur lors de l'ajout du créneau :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
async function adherantsParticiper(id_adherant, id_activite) { // pour verfier adhernent est participer ou non 
  console.log(id_adherant,id_activite)
  try {
    const [rows] = await db.query('SELECT id_utilisateur,id_activite FROM participation_activite  WHERE id_utilisateur=? AND id_activite=? ', [id_adherant, id_activite]);
    console.log("rows",rows)
    return rows.length != 0
  } catch (err) {
    console.log(err)
    return false
  }
}
router.post('/ParticiperActivite', async (req, res) => {
  const { idAdherant, idActivite, dateParticipation, heurParticipation } = req.body;
  console.log(idAdherant, idActivite, dateParticipation, heurParticipation)
  const isParticiper = await adherantsParticiper(idAdherant, idActivite)
  console.log(isParticiper)
  if (isParticiper)
   return res.json({ isParticiper: isParticiper, message: "vous etes deja participer dans cet activite" });
  else {
    try {
      const [result] = await db.execute(
        'INSERT INTO `participation_activite`(`id_utilisateur`, `id_activite`, `date_participation`, `heure_participation`) VALUES (?,?,?,?)',
        [idAdherant, idActivite, dateParticipation, heurParticipation]
      );
      res.status(201).json({ message: "Participation ajouté avec succès", id: result.insertId });
    } catch (error) {
      console.error("Erreur lors de participation :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
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
