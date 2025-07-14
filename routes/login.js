const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 🔍 Debug: Afficher les données reçues
  console.log("=== DEBUG LOGIN ===");
  console.log("Email reçu:", email);
  console.log("Password reçu:", password ? "***masqué***" : "VIDE");
  console.log("Body complet:", req.body);

  // Vérifier si les données sont présentes
  if (!email || !password) {
    console.log("❌ Email ou mot de passe manquant");
    return res.status(401).json({ message: "Email et mot de passe requis" });
  }

  try {
    const [rows] = await db.execute("SELECT * FROM utilisateurs WHERE email = ?", [email]);
    console.log("Nombre d'utilisateurs trouvés:", rows.length);

    if (rows.length === 0) {
      console.log("❌ Utilisateur non trouvé pour email:", email);
      return res.status(401).json({ message: "utilisateurs non trouvé" });
    } 

    const user = rows[0];
    console.log("✅ Utilisateur trouvé:", user.email);
    console.log("Hash en base:", user.mot_de_passe ? "présent" : "ABSENT");
    
    const isPasswordValid = await bcrypt.compare(password, user.mot_de_passe);
    console.log("Mot de passe valide:", isPasswordValid);
    
    if (!isPasswordValid) {
      console.log("❌ Mot de passe incorrect pour:", email);
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Vérifier JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.log("❌ JWT_SECRET manquant dans .env");
      return res.status(500).json({ message: "Configuration serveur manquante" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    console.log("✅ Connexion réussie pour:", email);
    res.json({ token, user: { id: user.id,nom:user.nom,prenom:user.prenom ,email: user.email,role:user.role,telephone : user.telephone,date_naissance : user.date_naissance,profesion:user.profesion } });
  } catch (error) {
    console.error("❌ Erreur dans /login:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post('/envoiEmail', async (req, res) => { // envoi email pour reintialiser motpass
  const { email } = req.body;
  console.log(email)
  if (!email) {
    return res.status(400).json({ message: 'Email requis.' });
  }
  
try {
    const [user] = await db.execute("SELECT id FROM utilisateurs WHERE email = ?", [email.toLowerCase()]);
    if (user.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    //Générer un token JWT avec expiration de 20 minutes
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '20m' }
    );

    //le lien avec le token
    const resetLink = `http://localhost:4200/reset-password?token=${token}`;

    const mailOptions = {
      from: `"Support Club" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Réinitialisation de mot de passe',
      html: `
        <h3>Bonjour,</h3>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe (valable 20 minutes) :</p>
        <a href="${resetLink}">${resetLink}</a>
        <br><br>
        <small>Ce lien expirera automatiquement après 20 minutes.</small>
      `
    };
    const transporter = nodemailer.createTransport({
  service: 'gmail', // ou autre: 'outlook', 'smtp.mailtrap.io', etc.
  auth: {
    user: process.env.EMAIL_USER, // ex: mouhsine.naghach@usmba.ac.ma
    pass: process.env.EMAIL_PASS  // à configurer dans ton .env (jamais en dur !)
  }
});

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Lien de réinitialisation envoyé.' });

  } catch (err) {
    console.error('Erreur:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});
router.post('/verify-token', (req, res) => {
  const {token} = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ email: decoded.email });
  } catch (err) {
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
});



router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email et nouveau mot de passe requis." });
  }

  
  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères." });
  }

  try {
   
    const [user] = await db.execute("SELECT id FROM utilisateurs WHERE email = ?", [email.toLowerCase()]);
    if (user.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.execute("UPDATE utilisateurs SET mot_de_passe = ? WHERE email = ?", [hashedPassword, email.toLowerCase()]);

    res.json({ message: "Mot de passe modifié avec succès." });
  } catch (err) {
    console.error("Erreur lors du reset du mot de passe :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

module.exports = router;