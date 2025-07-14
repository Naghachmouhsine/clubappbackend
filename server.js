const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();

// 🟡 Middlewares - Configuration CORS très permissive pour Capacitor et mobile
app.use(cors({
  origin: function (origin, callback) {
    // Permettre les requêtes sans origine (applications mobiles)
    if (!origin) return callback(null, true);
    
    // Permettre toutes les origines pour le développement
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

app.use(bodyParser.json());

// 🟢 Rendre le dossier uploads accessible publiquement (pour images)
app.use('/uploads', express.static('uploads'));

// 🟢 Import des routes
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const userProfileRoutes = require("./routes/userprofile");
const utilisateursRoutes = require("./routes/utilisateurs");
const installationsRoutes = require("./routes/installations");
const CreneauxRoutes = require("./routes/creneaux");
const ReservationRoutes = require("./routes/reservations");
const creneauxDisponiblesRoutes = require("./routes/creneauxDisponibles");
const payementStripe = require("./routes/payement/stripe");
const payementPaypal = require("./routes/payement/paypale");
const adherantsRoutes = require("./routes/adherants");
const evenementRouter=require("./routes/evenement")
const recempenseRouter=require("./routes/recempense")
const activiteRoutes = require("./routes/activites");
const statistiaueRouter=require("./routes/statistique")
// 🟢 Utilisation des routes
app.use("/api", loginRoutes);
app.use("/api", registerRoutes);
app.use("/api", userProfileRoutes);
app.use("/api", utilisateursRoutes);
app.use("/api", installationsRoutes);
app.use("/api", CreneauxRoutes);
app.use("/api", ReservationRoutes);
app.use("/api", creneauxDisponiblesRoutes);
app.use("/api", payementStripe);
app.use("/api", payementPaypal);
app.use("/api", adherantsRoutes);
app.use("/api/evenements", evenementRouter);
app.use("/api", recempenseRouter);
app.use("/api", activiteRoutes);
app.use('/api/statistique',statistiaueRouter)

const PORT = process.env.PORT || 3000;
// ✅ Écouter sur toutes les interfaces réseau (0.0.0.0) pour permettre les connexions externes
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Serveur lancé sur 0.0.0.0:${PORT}`);
  console.log(`🔗 Accessible depuis le réseau local sur http://[VOTRE_IP]:${PORT}`);
});
