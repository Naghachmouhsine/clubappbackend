const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ✅ Assure-toi que ce fichier exporte bien un `router`
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const userProfileRoutes = require("./routes/userprofile");
const utilisateursRoutes = require("./routes/utilisateurs");
const installationsRoutes = require('./routes/installations');
const CreneauxRoutes = require('./routes/creneaux');
const ReservationRoutes = require('./routes/reservations');
const creneauxDisponiblesRoutes = require('./routes/creneauxDisponibles');

app.use('/api', creneauxDisponiblesRoutes);
app.use('/api', ReservationRoutes);
app.use('/api', CreneauxRoutes);
app.use('/api', installationsRoutes);
app.use("/api", utilisateursRoutes);
app.use("/api", loginRoutes);
app.use("/api", registerRoutes);
app.use("/api", userProfileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);
});
