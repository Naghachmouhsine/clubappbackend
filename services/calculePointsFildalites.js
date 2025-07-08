const db = require('../db');


// 2. Fonction utilitaire pour récupérer les points d’un adhérent
async function getPoints(id) {
    const [rows] = await db.execute(
        `SELECT id_adherant, points FROM pointsfidelite WHERE id_adherant = ?`, [id]
    );
    return rows[0];
}

async function pointsAJouter(idAdherant,typeReinscription) {
    const categories = [
        { typeReinscription: 'Couple', point: 50 },
        { typeReinscription: 'Adulte seul', point: 40 },
        { typeReinscription: 'Couple senior', point: 35 },
        { typeReinscription: 'Senior seul', point: 30 },
        { typeReinscription: 'Étudiant', point: 25 },
        { typeReinscription: 'Jeune', point: 20 },
        { typeReinscription: 'Enfant', point: 15 },
        { typeReinscription: 'Nounou', point: 10 },
        { typeReinscription: 'Tennis', point: 5 },
        { typeReinscription: 'Padel', point: 10 }

    ];
    const current = await getPoints(idAdherant);
    const pointActualAdherant = current?.points || 0;
    const match = categories.find(p => p.typeReinscription === typeReinscription);
    if (!match) return null;
    const pointsAAjouter = match.point;
    return pointActualAdherant + pointsAAjouter
}

module.exports={pointsAJouter,getPoints}