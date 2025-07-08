const express = require('express');
const router = express.Router();
const db = require('../db');
const { getPoints } = require("../services/calculePointsFildalites")



router.post('/participer', async (req, res) => {
    const { idAdherant, idEvenement } = req.body;
    const connection = await db.getConnection();
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
        res.json({ message: "La recempense est réussie" });

    } catch (error) {
        console.error("Erreur lors de la réinscription :", error);
        if (connection) await connection.rollback();
        res.status(500).json({ message: "Erreur serveur pendant l'ajoute recempnse." });
    } finally {
        if (connection) connection.release();
    }
});












module.exports = router
