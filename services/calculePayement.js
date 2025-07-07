const db = require('../db');

function isWeekend(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDay();
  return day === 0 || day === 6;  // 0 = dimanche, 6 = samedi
}

function isJourFerieNational(dateStr) {
  const joursFeriesNationaux = [
  '2025-01-01', // Jour de l’An
  '2025-01-11', // Manifeste de l’indépendance
  '2025-05-01', // Fête du Travail
  '2025-07-30', // Fête du Trône
  '2025-08-14', // Récupération d’Oued Eddahab
  '2025-08-20', // Révolution du Roi et du Peuple
  '2025-08-21', // Fête de la Jeunesse (Anniversaire du Roi)
  '2025-11-06', // Marche Verte
  '2025-11-18'  // Fête de l’Indépendance
];
  return joursFeriesNationaux.includes(dateStr);
}
function isSoir(heureDebut) {
  return heureDebut >= '18:00:00';
}


async function getTarif(id_installation) { // recuprer tarif de base donnes
      const [rows] = await db.execute(`
      SELECT * FROM tarifs  WHERE installation_id=?
    `,[id_installation]);
    if(rows.length>0){
      tarifs=JSON.parse(rows[0].tarif)
      return tarifs
    }else
      return {}
}

async function calculeTarif(reservation) {
  console.log("Réservation reçue :", reservation);

  const tarif = await getTarif(reservation.id_installation);
  console.log("Tarif récupéré :", tarif);

  const nbrPersonn = reservation.nbr_personn;
  let montant = 0;

  switch (reservation.activite) {
    case "Tennis":
      if (reservation.infoReservation.avec_coach) {
        montant = tarif["avec_coach"] * nbrPersonn;
      } else {
        montant = tarif["sans_coach"] * nbrPersonn;
      }
      break;

    case "Piscine":
      if (isWeekend(reservation.date_creneau) || isJourFerieNational(reservation.date_creneau)) {
        montant = tarif["weekend_et_feries"] * nbrPersonn;
      } else {
        montant = tarif["semaine"] * nbrPersonn;
      }
      break;

    case "Padel":
      // const prixRaquette = reservation.infoReservation.nombre_raquetes*tarif["location_raquette"];
      if (reservation.isAdherant) {
        if (isSoir(reservation.heure_debut) || isWeekend(reservation.date_creneau) || isJourFerieNational(reservation.date_creneau)) {
          montant = tarif["adherents"]["soir_weekend_feries"]["prix_par_personne"] * nbrPersonn ;
        } else {
          montant = tarif["adherents"]["matin"]["prix_par_personne"] * nbrPersonn ;
        }
      } else {
          montant = tarif["non_adherents"]["prix_par_personne"] * nbrPersonn;
      }
      break;

    default:
      console.warn(`Activité inconnue : ${reservation.activite}`);
      montant = 0;
  }
  return montant;
}
module.exports={
    getTarif,
    calculeTarif
}