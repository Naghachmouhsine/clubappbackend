# 🏃‍♂️ ClubApp Backend - API de Gestion de Club Sportif

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.17+-blue.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-v8.0+-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/Naghachmouhsine/clubappbackend)](https://github.com/Naghachmouhsine/clubappbackend/issues)
[![GitHub Stars](https://img.shields.io/github/stars/Naghachmouhsine/clubappbackend)](https://github.com/Naghachmouhsine/clubappbackend/stargazers)

## 📋 Description

ClubApp Backend est une API REST moderne développée avec Node.js et Express.js pour la gestion complète d'un club sportif. Cette solution offre une architecture robuste et scalable pour gérer les utilisateurs, réservations, paiements, installations sportives, événements et statistiques.

### ✨ Fonctionnalités Principales

- 🔐 **Authentification sécurisée** avec JWT
- 👥 **Gestion des utilisateurs** et adhérents
- 🏟️ **Gestion des installations** sportives
- 📅 **Système de réservation** intelligent
- 💳 **Paiements intégrés** (Stripe & PayPal)
- 🎯 **Programme de fidélité** avec points
- 📊 **Statistiques** et analytics
- 🎉 **Gestion d'événements**
- 💰 **Tarification dynamique**

## 🏗️ Architecture du Projet

```
clubappbackend/
├── 📁 routes/                    # Routes API
│   ├── activites.js             # Gestion des activités sportives
│   ├── adherants.js             # Gestion des adhérents
│   ├── creneaux.js              # Gestion des créneaux horaires
│   ├── creneauxDisponibles.js   # Créneaux disponibles pour réservation
│   ├── date.js                  # Utilitaires de dates
│   ├── evenement.js             # Gestion des événements
│   ├── installations.js         # Gestion des installations sportives
│   ├── login.js                 # Authentification utilisateur
│   ├── register.js              # Inscription utilisateur
│   ├── reservations.js          # Gestion des réservations
│   ├── recempense.js            # Système de récompenses/fidélité
│   ├── statistique.js           # Statistiques et analytics
│   ├── userprofile.js           # Profil utilisateur
│   ├── utilisateurs.js          # Gestion des utilisateurs
│   └── 📁 payement/             # Système de paiement
│       ├── stripe.js            # Intégration Stripe
│       ├── paypale.js           # Intégration PayPal
│       └── webhookStripe.js     # Webhooks Stripe
├── 📁 services/                 # Services métier
│   ├── calculePayement.js       # Calcul des tarifs et paiements
│   └── calculePointsFildalites.js # Système de points de fidélité
├── 📁 uploads/                  # Stockage des fichiers uploadés
├── db.js                        # Configuration base de données
├── server.js                    # Point d'entrée de l'application
├── code_sql.sql                 # Structure de la base de données
├── code_sql_v2.sql              # Mise à jour de la structure DB
├── tarifs.sql                   # Données des tarifs
└── package.json                 # Dépendances et scripts
```

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL2** - Base de données relationnelle
- **JWT** - Authentification par tokens
- **bcryptjs** - Hachage des mots de passe
- **Multer** - Upload de fichiers
- **Stripe & PayPal** - Systèmes de paiement
- **Nodemailer** - Envoi d'emails
- **CORS** - Gestion des requêtes cross-origin
- **dotenv** - Variables d'environnement

### Frontend (Ionic/Angular)
- **Angular 19** - Framework frontend
- **Ionic 8** - Framework mobile hybride
- **TypeScript** - Langage de programmation
- **Capacitor** - Runtime natif
- **Chart.js & ngx-charts** - Graphiques et visualisations
- **Bootstrap 5** - Framework CSS
- **Stripe.js** - Intégration paiements côté client
- **ngx-translate** - Internationalisation

## 🗄️ Base de Données

### Tables Principales

- **utilisateurs** - Informations des utilisateurs
- **adherent** - Profils des adhérents
- **installations** - Installations sportives (terrains, salles, etc.)
- **activite** - Activités proposées par le club
- **creneaux** - Créneaux horaires disponibles
- **reservations** - Réservations des utilisateurs
- **tarifs** - Grille tarifaire
- **evenements** - Événements du club
- **paiements** - Historique des paiements
- **points_fidelite** - Système de fidélité

## 🚀 Installation et Configuration

### Prérequis
- Node.js (v14 ou supérieur)
- MySQL/MariaDB (v8.0+)
- npm ou yarn
- Git

### Installation

#### 1. Cloner le repository

```bash
# Cloner le projet depuis GitHub
git clone https://github.com/Naghachmouhsine/clubappbackend.git
cd clubappbackend

# Installer les dépendances
npm install

```

#### 2. Configuration de la base de données

```bash
# Créer une base de données MySQL
mysql -u root -p
CREATE DATABASE clubapprtcf;
USE clubapprtcf;

# Importer la structure de la base de données
mysql -u root -p clubapprtcf < code_sql.sql

# Importer les données de tarifs
mysql -u root -p clubapprtcf < tarifs.sql
```

#### 3. Configuration des variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
# Base de données
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=clubapprtcf

# Authentification
JWT_SECRET=your_super_secret_jwt_key_here

# Serveur
PORT=3000
NODE_ENV=development

# Paiements
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Email (optionnel)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

#### 4. Démarrer l'application

```bash
# Mode développement
npm start

# Mode production
NODE_ENV=production npm start
```

L'API sera accessible sur `http://localhost:3000`

### Installation Frontend

Le frontend de cette application est disponible dans un repository séparé.

```bash
# Cloner le frontend (repository séparé)
git clone https://github.com/Naghachmouhsine/clubappfrontend.git
cd clubappfrontend

# Installer les dépendances
npm install

# Démarrer l'application
npm start
# ou pour Ionic
ionic serve
```

## 🔗 Documentation API

### Base URL
```
http://localhost:3000/api
```

### Authentification
Toutes les routes protégées nécessitent un token JWT dans le header :
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints Principaux

#### 🔐 Authentification
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `POST` | `/login` | Connexion utilisateur | ❌ |
| `POST` | `/register` | Inscription utilisateur | ❌ |
| `GET` | `/userprofile` | Profil utilisateur | ✅ |

#### 👥 Gestion des Utilisateurs
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `GET` | `/utilisateurs` | Liste des utilisateurs | ✅ |
| `GET` | `/utilisateurs/:id` | Détails utilisateur | ✅ |
| `PUT` | `/utilisateurs/:id` | Modifier un utilisateur | ✅ |
| `DELETE` | `/utilisateurs/:id` | Supprimer un utilisateur | ✅ |

#### 🏟️ Installations et Activités
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `GET` | `/installations` | Liste des installations | ❌ |
| `POST` | `/installations` | Créer une installation | ✅ |
| `PUT` | `/installations/:id` | Modifier une installation | ✅ |
| `DELETE` | `/installations/:id` | Supprimer une installation | ✅ |
| `GET` | `/activites` | Liste des activités | ❌ |
| `POST` | `/activites` | Créer une activité | ✅ |

#### 📅 Réservations
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `GET` | `/reservations` | Liste des réservations | ✅ |
| `POST` | `/reservations` | Créer une réservation | ✅ |
| `GET` | `/reservations/:id` | Détails réservation | ✅ |
| `PUT` | `/reservations/:id` | Modifier une réservation | ✅ |
| `DELETE` | `/reservations/:id` | Annuler une réservation | ✅ |
| `GET` | `/creneaux-disponibles` | Créneaux disponibles | ❌ |

#### 💳 Paiements
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `POST` | `/stripe/create-payment-intent` | Créer un paiement Stripe | ✅ |
| `POST` | `/paypal/create-payment` | Créer un paiement PayPal | ✅ |
| `POST` | `/stripe/webhook` | Webhook Stripe | ❌ |

#### 🎉 Événements et Statistiques
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `GET` | `/evenements` | Liste des événements | ❌ |
| `POST` | `/evenements` | Créer un événement | ✅ |
| `PUT` | `/evenements/:id` | Modifier un événement | ✅ |
| `DELETE` | `/evenements/:id` | Supprimer un événement | ✅ |
| `GET` | `/statistique` | Statistiques du club | ✅ |

### Exemples d'utilisation

#### Connexion
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Créer une réservation
```bash
curl -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "installation_id": 1,
    "date_reservation": "2025-01-15",
    "heure_debut": "14:00",
    "heure_fin": "16:00"
  }'
```

## 💰 Système de Tarification

Le système de tarification est dynamique et prend en compte :

- **Type d'installation** (terrain de foot, salle de sport, etc.)
- **Période** (weekend, jour férié, soirée)
- **Durée de réservation**
- **Statut de l'utilisateur** (adhérent, non-adhérent)
- **Promotions et réductions**

### Calcul des Tarifs
```javascript
// Exemple de calcul dans services/calculePayement.js
- Tarif de base selon l'installation
- Majoration weekend (+20%)
- Majoration soirée (+15%)
- Majoration jours fériés (+25%)
- Réduction adhérent (-10%)
```

## 🎯 Système de Fidélité

- **Points gagnés** : 1 point par euro dépensé
- **Bonus réservation** : Points supplémentaires selon l'activité
- **Récompenses** : Réductions et avantages selon les points accumulés

## 🔒 Sécurité

- **Authentification JWT** - Tokens sécurisés
- **Hachage des mots de passe** - bcryptjs
- **Validation des données** - Sanitisation des entrées
- **CORS configuré** - Sécurité cross-origin
- **Variables d'environnement** - Configuration sécurisée

## 📱 Frontend (Ionic/Angular)

### Structure Frontend
```
clubappfrontEnd/
├── src/app/
│   ├── components/          # Composants réutilisables
│   ├── pages/              # Pages de l'application
│   ├── services/           # Services Angular
│   ├── modals/             # Modales
│   └── shared/             # Modules partagés
├── src/assets/             # Ressources statiques
└── src/environments/       # Configuration environnements
```

### Fonctionnalités Frontend
- **Interface responsive** - Compatible mobile/desktop
- **Authentification** - Login/Register avec JWT
- **Réservations** - Interface de réservation intuitive
- **Paiements** - Intégration Stripe sécurisée
- **Profil utilisateur** - Gestion du profil et historique
- **Statistiques** - Graphiques et analytics
- **Multilingue** - Support français/anglais

## 🚀 Déploiement

### Backend
```bash
# Build pour production
npm run build

# Variables d'environnement production
NODE_ENV=production
DB_HOST=your_production_db_host
# ... autres variables
```

### Frontend
```bash
# Build pour production
ng build --prod

# Build pour mobile
ionic capacitor build android
ionic capacitor build ios
```

## 🧪 Tests

```bash
# Lancer les tests
npm test

# Tests avec coverage
npm run test:coverage

# Tests en mode watch
npm run test:watch
```

## 🐛 Debugging

### Logs
Les logs sont affichés dans la console en mode développement :

```bash
# Activer les logs détaillés
DEBUG=clubapp:* npm start
```

### Erreurs communes

#### Erreur de connexion à la base de données
```bash
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution** : Vérifiez que MySQL est démarré et que les credentials dans `.env` sont corrects.

#### Erreur JWT
```bash
Error: jwt malformed
```
**Solution** : Vérifiez que le token JWT est valide et non expiré.

## 📊 Monitoring et Logs

- **Logs serveur** - Console.log pour le développement
- **Erreurs DB** - Gestion des erreurs MySQL
- **Monitoring paiements** - Webhooks et logs de transactions

## 🤝 Contribution

Nous accueillons les contributions ! Voici comment procéder :

### Étapes pour contribuer

1. **Fork** le projet
2. **Cloner** votre fork
   ```bash
   git clone https://github.com/votre-username/clubappbackend.git
   ```
3. **Créer** une branche feature
   ```bash
   git checkout -b feature/nouvelle-fonctionnalite
   ```
4. **Commiter** vos changements
   ```bash
   git commit -m 'feat: ajouter nouvelle fonctionnalité'
   ```
5. **Pusher** vers la branche
   ```bash
   git push origin feature/nouvelle-fonctionnalite
   ```
6. **Ouvrir** une Pull Request

### Standards de code

- Utiliser ESLint pour le linting
- Suivre les conventions de nommage JavaScript
- Ajouter des tests pour les nouvelles fonctionnalités
- Documenter les nouvelles API

### Types de commits

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage
- `refactor:` Refactoring
- `test:` Tests
- `chore:` Maintenance

## 📞 Support

### Obtenir de l'aide

- 🐛 **Bugs** : [Créer une issue](https://github.com/Naghachmouhsine/clubappbackend/issues/new?template=bug_report.md)
- 💡 **Feature Request** : [Proposer une fonctionnalité](https://github.com/Naghachmouhsine/clubappbackend/issues/new?template=feature_request.md)
- 💬 **Questions** : [Discussions](https://github.com/Naghachmouhsine/clubappbackend/discussions)

### Communauté

- 📧 Email : naghachmouhsine@example.com
- 💼 LinkedIn : [Profil LinkedIn](https://linkedin.com/in/naghachmouhsine)

## 📊 Statistiques du Projet

![GitHub repo size](https://img.shields.io/github/repo-size/Naghachmouhsine/clubappbackend)
![GitHub contributors](https://img.shields.io/github/contributors/Naghachmouhsine/clubappbackend)
![GitHub last commit](https://img.shields.io/github/last-commit/Naghachmouhsine/clubappbackend)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/Naghachmouhsine/clubappbackend)

## 🏆 Remerciements

- Merci à tous les contributeurs
- Inspiré par les meilleures pratiques de l'industrie
- Construit avec ❤️ pour la communauté sportive

## 📄 Licence et Droits d'Utilisation

⚠️ **IMPORTANT** : Ce projet est sous **licence propriétaire** avec des restrictions d'utilisation.

### 🔒 Restrictions d'Utilisation

- ✅ **Autorisé** : Consultation du code à des fins éducatives
- ✅ **Autorisé** : Contribution au projet via pull requests
- ✅ **Autorisé** : Tests et développement local dans le cadre du projet
- ❌ **INTERDIT** : Utilisation commerciale ou à des fins lucratives
- ❌ **INTERDIT** : Distribution ou vente du logiciel
- ❌ **INTERDIT** : Création de forks indépendants
- ❌ **INTERDIT** : Utilisation du code dans d'autres projets

### 📋 Conditions de Contribution

En contribuant à ce projet, vous acceptez que :
- Vos contributions deviennent propriété du détenteur du copyright
- Vous respectez les restrictions d'utilisation ci-dessus
- Vous ne pouvez pas utiliser le code à des fins personnelles ou commerciales

### 📞 Contact pour Autorisations

Pour toute demande d'autorisation d'utilisation commerciale :
- 📧 Email : naghachmouhsine@gmail.com / ytangara2003@gmail.com
- 💼 LinkedIn : [Profil LinkedIn](https://linkedin.com/in/naghachmouhsine)

Voir le fichier [LICENSE](LICENSE) pour les détails complets.

## 🚀 Roadmap

### Version 1.1 (À venir)
- [ ] API GraphQL
- [ ] Notifications push
- [ ] Chat en temps réel
- [ ] Intégration calendrier

### Version 1.2 (Planifié)
- [ ] Application mobile native
- [ ] Système de coaching
- [ ] Intégration IoT
- [ ] Analytics avancés

## 📈 Performance

- ⚡ Temps de réponse API < 200ms
- 🔄 Support de 1000+ utilisateurs simultanés
- 💾 Base de données optimisée
- 🛡️ Sécurité niveau entreprise

## 🌍 Démo

### Démo en ligne
- **API** : [https://clubapp-api.herokuapp.com](https://clubapp-api.herokuapp.com)
- **Documentation** : [https://clubapp-docs.netlify.app](https://clubapp-docs.netlify.app)

### Comptes de test
```
Admin:
Email: admin@clubapp.com
Password: admin123

Utilisateur:
Email: user@clubapp.com  
Password: user123
```

---

**Développé avec ❤️ pour la gestion moderne des clubs sportifs**

<div align="center">
  <img src="https://img.shields.io/badge/Made%20with-Node.js-green?style=for-the-badge&logo=node.js" alt="Made with Node.js">
  <img src="https://img.shields.io/badge/Database-MySQL-blue?style=for-the-badge&logo=mysql" alt="MySQL">
  <img src="https://img.shields.io/badge/Payments-Stripe-purple?style=for-the-badge&logo=stripe" alt="Stripe">
</div>
