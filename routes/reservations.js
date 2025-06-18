const express = require('express');
const router = express.Router();
const db = require('../db');

// Validation date ISO YYYY-MM-DD
function isValidDate(dateString) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

// Validation heure HH:MM 24h
function isValidTime(timeString) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(timeString);
}


function currentDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


// GET : Liste toutes les réservations avec infos utilisateur et créneau
router.get('/reservations', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT r.id, r.id_utilisateur, r.id_creneau, r.statut,
             u.nom AS utilisateur_nom, u.email AS utilisateur_email,
             c.date AS creneau_date, c.heure_debut, c.heure_fin
      FROM reservations r
      JOIN utilisateurs u ON r.id_utilisateur = u.id
      JOIN creneaux c ON r.id_creneau = c.id
    `);
    res.json(rows);
  } catch (error) {
    console.error("Erreur lors du fetch des réservations :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET : Détail d’une réservation
router.get('/reservations/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await db.execute(`
      SELECT r.id, r.date_reservation, r.id_utilisateur, r.id_creneau, r.statut,
             u.nom AS utilisateur_nom, u.email AS utilisateur_email,
             c.date AS creneau_date, c.heure_debut, c.heure_fin
      FROM reservations r
      JOIN utilisateurs u ON r.id_utilisateur = u.id
      JOIN creneaux c ON r.id_creneau = c.id
      WHERE r.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Erreur lors du fetch de la réservation :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST : Ajouter une réservation
router.post('/reservations', async (req, res) => {
  const {id_installation,nbr_installation_reserver,id_utilisateur, id_creneau, statut } = req.body;

  console.log(req.body)
  // if (!isValidDate(date_reservation)) {
  //   return res.status(400).json({ message: "Date de réservation invalide (YYYY-MM-DD)" });
  // }
  if (typeof id_utilisateur !== 'number' || id_utilisateur <= 0) {
    return res.status(400).json({ message: "ID utilisateur invalide" });
  }
  if (typeof id_creneau !== 'number' || id_creneau <= 0) {
    return res.status(400).json({ message: "ID créneau invalide" });
  }
  if (typeof statut !== 'string' || !['confirmée', 'en attente', 'annulée'].includes(statut.toLowerCase())) {
    return res.status(400).json({ message: "Statut invalide (confirmée, en attente, annulée)" });
  }
  const connection = await db.getConnection(); 
try {
    await connection.beginTransaction(); //Début transaction
    console.log("1")
    //Insertion de la réservation
    const [insertResult] = await connection.execute(
      'INSERT INTO reservations (id_utilisateur, id_creneau, date_jour_reservation, statut) VALUES (?, ?, ?, ?)',
      [id_utilisateur, id_creneau, currentDateTime(), statut]
    );
    console.log("2")

    //Modification le statut du créneau réservé
    await connection.execute(
      'UPDATE `creneaux` SET `disponible`="non" WHERE id=?',
      [id_creneau]
    );
    console.log("3")

    // modification nombre d'installation
    await connection.execute(
      'UPDATE `installations` SET `nbr`=?  WHERE id=?',
      [nbr_installation_reserver,id_installation]
    )
    console.log("4")

    await connection.commit();
    res.status(201).json({ message: 'Réservation confirmée', id: insertResult.insertId });

  } catch (error) {
    await connection.rollback(); // Annuler si erreur
    console.error('Erreur transactionnelle :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la réservation' });
  } finally {
    connection.release(); //libérer la connexion
  }
});

// PUT : Modifier une réservation
router.put('/reservations/:id', async (req, res) => {
  const id = req.params.id;
  const { date_reservation, id_utilisateur, id_creneau, statut } = req.body;

  if (!isValidDate(date_reservation)) {
    return res.status(400).json({ message: "Date de réservation invalide (YYYY-MM-DD)" });
  }
  if (typeof id_utilisateur !== 'number' || id_utilisateur <= 0) {
    return res.status(400).json({ message: "ID utilisateur invalide" });
  }
  if (typeof id_creneau !== 'number' || id_creneau <= 0) {
    return res.status(400).json({ message: "ID créneau invalide" });
  }
  if (typeof statut !== 'string' || !['confirmée', 'en attente', 'annulée'].includes(statut.toLowerCase())) {
    return res.status(400).json({ message: "Statut invalide (confirmée, en attente, annulée)" });
  }

  try {
    const [result] = await db.execute(
      'UPDATE reservations SET date_reservation = ?, id_utilisateur = ?, id_creneau = ?, statut = ? WHERE id = ?',
      [date_reservation, id_utilisateur, id_creneau, statut, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }
    res.json({ message: "Réservation mise à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la réservation :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE : Supprimer une réservation
router.delete('/reservations/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await db.execute('DELETE FROM reservations WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }
    res.json({ message: "Réservation supprimée" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la réservation :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
