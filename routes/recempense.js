const express = require('express');
const router = express.Router();
const db = require('../db');
const { getPoints } = require("../services/calculePointsFildalites")

router.post('/ajouterRecempense', async (req, res) => {
    const { idAdherant, idRecompense, points } = req.body;
    const connection = await db.getConnection();
    const pointAdheran = await getPoints(idAdherant)
    const pointsModifer = pointAdheran.points - points
    console.log(pointAdheran, points, pointsModifer)
    try {

        await connection.beginTransaction();

        // ajoute recempense dans la table
        await connection.execute(
            `INSERT INTO adherants_recompense (idAdherant,idRecompense) VALUES (?,?)`,
            [idAdherant, idRecompense]
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


router.get('/getAllRecempense', async (req, res) => { //les recepmnse dans la base donnes
    try {
        const [rows] = await db.execute(
            `SELECT * FROM recompense`
        );
        res.json(rows);
    } catch (error) {
        console.error("Erreur lors du fetch des points :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


module.exports = router