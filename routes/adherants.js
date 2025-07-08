const express = require('express');
const router = express.Router();
const db = require('../db');
const { pointsAJouter, getPoints } = require("../services/calculePointsFildalites")
// 1. Récupérer les adhérents
router.get('/adherants', async (req, res) => {
    try {
        const [rows] = await db.execute(`
      SELECT 
        u.id,
        u.nom,
        u.prenom,
        u.email,
        u.telephone,
        u.role,
        u.date_naissance,
        u.genre,
        a.statut_abonnement,
        a.date_inscription,
        p.points as totalPoints
      FROM utilisateurs u
      LEFT JOIN adherent a ON u.id = a.id_utilisateur
      LEFT JOIN pointsfidelite p ON p.id_adherant=u.id
      WHERE u.role = "adherent"
    `);
        res.json(rows);
    } catch (error) {
        console.error("Erreur lors du fetch des adhérents :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


// 3. Récupérer les points par ID
router.get('/getPoints/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const points = await getPoints(id);
        res.json(points);
    } catch (error) {
        console.error("Erreur lors du fetch des points :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.put('/updateTotalPoints/:id', async (req, res) => {
  const id = req.params.id;
  const { totalPoints } = req.body;

  try {
    const [result] = await db.execute(
      `
      INSERT INTO pointsfidelite (id_adherant, points)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE points = ?
      `,
      [id, totalPoints, totalPoints]
    );

    res.json({ message: "Points totaux mis à jour avec succès." });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des points :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// 4. Reinscription avec commit/rollback
router.put('/reinscription', async (req, res) => {
    const { idAdherant, typeReinscription } = req.body;



    const match = categories.find(p => p.typeReinscription === typeReinscription);
    if (!match) {
        return res.status(400).json({ message: "Type de réinscription invalide." });
    }
    const connection = await db.getConnection();

    try {

        const pointsAAjouter = await pointsAJouter(idAdherant, typeReinscription)

        const now = new Date();
        const date_inscription = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()}`;


        await connection.beginTransaction();

        // Mise à jour des infos d'abonnement
        await connection.execute(
            `UPDATE adherent 
       SET date_inscription = ?, typeReinscription = ?, statut_abonnement = ? 
       WHERE id_utilisateur = ?`,
            [date_inscription, typeReinscription, 'Active', idAdherant]
        );

        // Cumuler les points au lieu de les écraser
        await connection.execute(
            `UPDATE pointsfidelite 
       SET points = ? 
       WHERE id_adherant = ?`,
            [pointsAAjouter, idAdherant]
        );

        await connection.commit();
        res.json({ message: "Réinscription réussie. Points cumulés." });

    } catch (error) {
        console.error("Erreur lors de la réinscription :", error);
        if (connection) await connection.rollback();
        res.status(500).json({ message: "Erreur serveur pendant la réinscription." });
    } finally {
        if (connection) connection.release();
    }
});



module.exports = router;
