const express = require('express');
const router = express.Router();
const db = require('../db');
const { json } = require('body-parser');
const { getTarif, calculeTarif } = require("../services/calculePayement")
const {pointsAJouter}=require("../services/calculePointsFildalites")

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
                    SELECT r.id, r.date_jour_reservation,r.statut,c.date AS creneau_date,
                        c.heure_debut, c.heure_fin,i.nom as installation
                          FROM reservations r
                          JOIN utilisateurs u ON r.id_utilisateur = u.id
                          JOIN creneaux c ON r.id_creneau = c.id
                          JOIN installations i ON c.id_installation=i.id
                          WHERE u.id = ?
                          ORDER BY r.date_jour_reservation DESC;
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Erreur lors du fetch de la réservation :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST : Ajouter une réservation
router.post('/reservations', async (req, res) => {
  const reservation = req.body;
  const {
    id_installation,
    nbr_installation_reserver,
    id_utilisateur,
    id_creneau,
    nbr_personn,
    statut,
    activite
  } = reservation

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Insertion réservation
    const [insertResult] = await connection.execute(
      'INSERT INTO reservations (id_utilisateur, id_creneau, date_jour_reservation, nbr_personn, statut) VALUES (?, ?, NOW(), ?, ?)',
      [id_utilisateur, id_creneau, nbr_personn, statut]
    );

    // Maj des créneaux
    await connection.execute(
      'UPDATE `creneaux` SET `disponible`="non" WHERE id=?',
      [id_creneau]
    );

    // Maj des installations
    await connection.execute(
      'UPDATE `installations` SET `nbr`=? WHERE id=?',
      [nbr_installation_reserver, id_installation]
    );
    if (activite === "Tennis" || activite === "Padel") {
      const points = await pointsAJouter(id_utilisateur,activite)
      await connection.execute(
        ` INSERT INTO pointsfidelite (id_adherant, points)
           VALUES (?, ?)
           ON DUPLICATE KEY UPDATE points = ?`,
        [id_utilisateur,points,points]
      );
    }



    await connection.commit();

    if (res) {
      res.status(201).json({ message: 'Réservation confirmée', id: insertResult.insertId });
    }
    return insertResult.insertId;

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});
router.put("/updateStatus", async (req, res) => {
  const { id, status } = req.body
  try {
    const [result] = await db.execute(
      'UPDATE reservations SET statut = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }
    res.json({ message: "Réservation mise à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la réservation :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
})
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

async function reserver(reservation, res = null) {
  const {
    id_installation,
    nbr_installation_reserver,
    id_utilisateur,
    id_creneau,
    nbr_personn,
    statut,
    infoReservation
  } = reservation;

  // // Validation basique
  // if (typeof id_utilisateur !== 'number' || id_utilisateur <= 0) {
  //   throw new Error("ID utilisateur invalide");
  // }
  // if (typeof id_creneau !== 'number' || id_creneau <= 0) {
  //   throw new Error("ID créneau invalide");
  // }
  // if (typeof statut !== 'string' || !['confirmée', 'en attente', 'annulée'].includes(statut.toLowerCase())) {
  //   throw new Error("Statut invalide");
  // }

  // const connection = await db.getConnection();
  // try {
  //   await connection.beginTransaction();

  //   // Insertion réservation
  //   const [insertResult] = await connection.execute(
  //     'INSERT INTO reservations (id_utilisateur, id_creneau, date_jour_reservation, nbr_personn, statut) VALUES (?, ?, NOW(), ?, ?)',
  //     [id_utilisateur, id_creneau, nbr_personn, statut]
  //   );

  //   // Maj des créneaux
  //   await connection.execute(
  //     'UPDATE `creneaux` SET `disponible`="non" WHERE id=?',
  //     [id_creneau]
  //   );

  //   // Maj des installations
  //   await connection.execute(
  //     'UPDATE `installations` SET `nbr`=? WHERE id=?',
  //     [nbr_installation_reserver, id_installation]
  //   );

  //   await connection.commit();

  //   if (res) {
  //     res.status(201).json({ message: 'Réservation confirmée', id: insertResult.insertId });
  //   }

  //   return insertResult.insertId;

  // } catch (error) {
  //   await connection.rollback();
  //   throw error;
  // } finally {
  //   connection.release();
  // }
}
module.exports = { getTarif }
module.exports = router;
