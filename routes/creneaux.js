const express = require('express');
const router = express.Router();
const db = require('../db');

// Fonction utilitaire pour valider date ISO YYYY-MM-DD
function isValidDate(dateString) {
  // Regex ISO date simple
  return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

// Fonction utilitaire pour valider heure au format HH:MM (24h)
function isValidTime(timeString) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(timeString);
}
// GET : Liste de tous les créneaux

router.get('/Allcreneaux', async (req, res) => {
  const {activite}=req.query
  console.log(activite)
  // if (!activite || !date) {
  //   return res.status(400).json({ error: 'Paramètres "activite" et "date" requis' });
  // }

  try {
    const [rows] = await db.execute(`
         SELECT c.id,c.date,c.heure_debut,c.heure_fin,c.id_installation,c.disponible,i.capacite,i.nbr,i.type
          FROM creneaux as c, installations as i
          WHERE c.id_installation=i.id;
    `
  );
    res.json(rows);
  } catch (error) {
    console.error("Erreur lors du fetch des créneaux :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }

});
router.get('/creneauxDisponibles', async (req, res) => {
  const {activite}=req.query
  console.log(activite)
  // if (!activite || !date) {
  //   return res.status(400).json({ error: 'Paramètres "activite" et "date" requis' });
  // }
  if (!activite) {
    return res.status(400).json({ error: 'Paramètres "activite" requis' });
  }
  try {
    const [rows] = await db.execute(`
         SELECT c.id,c.date,c.heure_debut,c.heure_fin,c.id_installation,i.capacite,i.nbr,i.type
          FROM creneaux as c, installations as i
          WHERE c.disponible="oui"
          AND c.id_installation=i.id
          AND i.type=?
          AND i.disponible="oui";
    `,
    [activite]
  );
    res.json(rows);
  } catch (error) {
    console.error("Erreur lors du fetch des créneaux :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }

});

// router.get('/api/creneaux-disponibles', (req, res) => {
//   const { activite, date } = req.query;

//   if (!activite || !date) {
//     return res.status(400).json({ error: 'Paramètres "activite" et "date" requis' });
//   }

//   const sql = `
//    SELECT c.id,c.date,c.heure_debut,c.heure_fin
//     FROM creneaux as c, installations as i
//     WHERE c.date=?
//     AND c.disponible="oui"
//     AND c.id_installation=i.id
//     AND i.type=?
//     AND i.disponible="oui";
//   `;

//   connection.query(sql, [date,activite], (err, results) => {
//     if (err) {
//       console.error('Erreur lors de la récupération des créneaux :', err);
//       return res.status(500).json({ error: 'Erreur serveur' });
//     }

//     res.json(results);
//   });
// });

// GET : Détail d’un créneau
router.get('/creneaux/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await db.execute(`
      SELECT c.id, c.date, c.heure_debut, c.heure_fin, c.disponible, 
             c.id_installation,
             i.nom AS installation_nom, i.type AS installation_type
      FROM creneaux c
      JOIN installations i ON c.id_installation = i.id
      WHERE c.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Créneau non trouvé" });
    }
    
    // renvoyer un objet clair avec les infos créneau + installation
    const creneau = rows[0];
    
    console.log(creneau);
    console.log("-----")
    console.log(rows[0]);
    res.json({
      id: creneau.id,
      date: creneau.date,
      heure_debut: creneau.heure_debut,
      heure_fin: creneau.heure_fin,
      disponible: creneau.disponible,
      installation_id: creneau.id_installation,
      installation_nom: creneau.installation_nom,
      installation_type: creneau.installation_type
    });
  } catch (error) {
    console.error("Erreur lors du fetch du créneau :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// POST : Ajouter un créneau avec validation
router.post('/creneaux', async (req, res) => {
  const { date, heure_debut, heure_fin, installation_id, disponible } = req.body;
  console.log({ date, heure_debut, heure_fin, installation_id, disponible })
  // Validation des données
  if (!isValidDate(date)) {
    return res.status(400).json({ message: "Date invalide (format attendu: YYYY-MM-DD)" });
  }
  if (!isValidTime(heure_debut) || !isValidTime(heure_fin)) {
    return res.status(400).json({ message: "Heure invalide (format attendu: HH:MM)" });
  }
  if (typeof installation_id !== 'number' || installation_id <= 0) {
    return res.status(400).json({ message: "ID installation invalide" });
  }
  // if (typeof disponible !== 'boolean') {
  //   return res.status(400).json({ message: "Disponible doit être un booléen" });
  // }

  try {
    const [result] = await db.execute(
      'INSERT INTO creneaux (date, heure_debut, heure_fin, id_installation, disponible) VALUES (?, ?, ?, ?, ?)',
      [date, heure_debut, heure_fin, installation_id, disponible]
    );
    res.status(201).json({ message: "Créneau ajouté avec succès", id: result.insertId });
  } catch (error) {
    console.error("Erreur lors de l'ajout du créneau :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PUT : Modifier un créneau avec validation
router.put('/creneaux/:id', async (req, res) => {
  const id = req.params.id;
  const { date, heure_debut, heure_fin, installation_id, disponible } = req.body;

  // Validation des données
  if (!isValidDate(date)) {
    return res.status(400).json({ message: "Date invalide (format attendu: YYYY-MM-DD)" });
  }
  if (!isValidTime(heure_debut) || !isValidTime(heure_fin)) {
    return res.status(400).json({ message: "Heure invalide (format attendu: HH:MM)" });
  }
  if (typeof installation_id !== 'number' || installation_id <= 0) {
    return res.status(400).json({ message: "ID installation invalide" });
  }
  /*
  if (typeof disponible !== 'boolean') {
    return res.status(400).json({ message: "Disponible doit être un booléen" });
  }*/

  try {
    const [result] = await db.execute(
      'UPDATE creneaux SET date = ?, heure_debut = ?, heure_fin = ?, id_installation = ?, disponible = ? WHERE id = ?',
      [date, heure_debut, heure_fin, installation_id, disponible, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Créneau non trouvé" });
    }
    res.json({ message: "Créneau mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du créneau :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE : Supprimer un créneau
router.delete('/creneaux/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await db.execute('DELETE FROM creneaux WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Créneau non trouvé" });
    }
    res.json({ message: "Créneau supprimé" });
  } catch (error) {
    console.error("Erreur lors de la suppression du créneau :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
