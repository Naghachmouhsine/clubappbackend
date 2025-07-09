const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rendre le dossier uploads accessible publiquement (pour images)
app.use('/uploads', express.static('uploads'));

// Import des routes
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const userProfileRoutes = require("./routes/userprofile");
const utilisateursRoutes = require("./routes/utilisateurs");
const installationsRoutes = require('./routes/installations');
const CreneauxRoutes = require('./routes/creneaux');
const ReservationRoutes = require('./routes/reservations');
const creneauxDisponiblesRoutes = require('./routes/creneauxDisponibles');
const payementStrip = require("./routes/payement/stripe");
const payementPaypale = require("./routes/payement/paypale");
const adherantsRoutes = require("./routes/adherants");
const evenementRouter = require('./routes/evenement'); // attention au nom exact du fichier

// Utilisation des routes
app.use('/api', creneauxDisponiblesRoutes);
app.use('/api', ReservationRoutes);
app.use('/api', CreneauxRoutes);
app.use('/api', installationsRoutes);
app.use("/api", utilisateursRoutes);
app.use("/api", loginRoutes);
app.use("/api", registerRoutes);
app.use("/api", userProfileRoutes);
app.use("/api", payementStrip);
app.use("/api", payementPaypale);
app.use("/api", adherantsRoutes);

// Route événements (avec gestion images)
app.use('/api/evenements', evenementRouter);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);
});
