const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute("SELECT * FROM utilisateurs WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "utilisateurs non trouvé" });
    }

    const user = rows[0];
    console.log("password",user.mot_de_passe);
    console.log("password2",password);
    const isPasswordValid = await bcrypt.compare(password, user.mot_de_passe);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, user: { id: user.id, email: user.email,role:user.role,telephone : user.telephone,date_naissance : user.date_naissance,profesion:user.profesion } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;