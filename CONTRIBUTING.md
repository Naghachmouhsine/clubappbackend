# 🤝 Guide de Contribution - ClubApp Backend

Merci de votre intérêt pour contribuer à ClubApp Backend ! Ce guide vous aidera à comprendre comment contribuer efficacement au projet.

## 📋 Table des Matières

- [Code de Conduite](#code-de-conduite)
- [Comment Contribuer](#comment-contribuer)
- [Standards de Développement](#standards-de-développement)
- [Processus de Pull Request](#processus-de-pull-request)
- [Signaler des Bugs](#signaler-des-bugs)
- [Proposer des Fonctionnalités](#proposer-des-fonctionnalités)

## 📜 Code de Conduite

Ce projet adhère au [Code de Conduite Contributor Covenant](https://www.contributor-covenant.org/). En participant, vous vous engagez à respecter ce code.

## 🚀 Comment Contribuer

### Prérequis

- Node.js (v14+)
- MySQL (v8.0+)
- Git
- Connaissance de JavaScript/Node.js

### Configuration de l'Environnement de Développement

1. **Fork** le repository
2. **Cloner** votre fork
   ```bash
   git clone https://github.com/votre-username/clubappbackend.git
   cd clubappbackend
   ```

3. **Installer** les dépendances
   ```bash
   npm install
   ```

4. **Configurer** la base de données
   ```bash
   # Créer la base de données
   mysql -u root -p -e "CREATE DATABASE clubapprtcf_dev;"
   
   # Importer la structure
   mysql -u root -p clubapprtcf_dev < code_sql.sql
   ```

5. **Configurer** les variables d'environnement
   ```bash
   cp .env.example .env
   # Éditer .env avec vos paramètres
   ```

6. **Démarrer** le serveur de développement
   ```bash
   npm run dev
   ```

## 🛠️ Standards de Développement

### Style de Code

- Utiliser **ESLint** pour le linting
- Suivre les conventions **JavaScript Standard Style**
- Indentation : **2 espaces**
- Point-virgules : **obligatoires**

### Conventions de Nommage

- **Variables** : camelCase (`userName`, `isActive`)
- **Fonctions** : camelCase (`getUserById`, `calculatePrice`)
- **Constantes** : UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **Fichiers** : kebab-case (`user-service.js`)

### Structure des Commits

Utiliser la convention [Conventional Commits](https://www.conventionalcommits.org/) :

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types de commits :**
- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage, point-virgules manquants, etc.
- `refactor:` Refactoring du code
- `test:` Ajout ou modification de tests
- `chore:` Maintenance, mise à jour des dépendances

**Exemples :**
```bash
feat(auth): ajouter authentification OAuth2
fix(reservations): corriger calcul des créneaux disponibles
docs(api): mettre à jour documentation des endpoints
```

### Tests

- Écrire des tests pour toute nouvelle fonctionnalité
- Maintenir une couverture de code > 80%
- Utiliser Jest pour les tests unitaires

```bash
# Lancer les tests
npm test

# Tests avec couverture
npm run test:coverage

# Tests en mode watch
npm run test:watch
```

## 🔄 Processus de Pull Request

### Avant de Soumettre

1. **Vérifier** que les tests passent
   ```bash
   npm test
   ```

2. **Vérifier** le linting
   ```bash
   npm run lint
   ```

3. **Mettre à jour** la documentation si nécessaire

4. **Tester** manuellement les changements

### Soumettre une Pull Request

1. **Créer** une branche feature
   ```bash
   git checkout -b feature/nom-de-la-fonctionnalite
   ```

2. **Faire** vos changements et commits
   ```bash
   git add .
   git commit -m "feat: ajouter nouvelle fonctionnalité"
   ```

3. **Pusher** vers votre fork
   ```bash
   git push origin feature/nom-de-la-fonctionnalite
   ```

4. **Créer** une Pull Request sur GitHub

### Template de Pull Request

```markdown
## 📋 Description
Brève description des changements

## 🔄 Type de Changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## 🧪 Tests
- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Tests manuels effectués
- [ ] Tous les tests passent

## 📝 Checklist
- [ ] Code respecte les standards du projet
- [ ] Documentation mise à jour
- [ ] Changements testés localement
```

## 🐛 Signaler des Bugs

1. **Vérifier** que le bug n'a pas déjà été signalé
2. **Utiliser** le template de bug report
3. **Inclure** :
   - Description claire du problème
   - Étapes pour reproduire
   - Comportement attendu vs actuel
   - Environnement (OS, versions, etc.)
   - Logs d'erreur

## 💡 Proposer des Fonctionnalités

1. **Vérifier** que la fonctionnalité n'existe pas déjà
2. **Utiliser** le template de feature request
3. **Inclure** :
   - Description de la fonctionnalité
   - Cas d'usage
   - Bénéfices attendus
   - Alternatives considérées

## 🏷️ Labels

- `bug` : Problème confirmé
- `enhancement` : Nouvelle fonctionnalité
- `documentation` : Amélioration de la documentation
- `good first issue` : Bon pour les nouveaux contributeurs
- `help wanted` : Aide recherchée
- `priority:high` : Priorité élevée
- `priority:low` : Priorité basse

## 🎯 Domaines de Contribution

### Backend
- API REST endpoints
- Authentification et autorisation
- Intégrations de paiement
- Optimisation des performances
- Sécurité

### Base de Données
- Optimisation des requêtes
- Migrations
- Indexation
- Sauvegarde et restauration

### Documentation
- README
- Documentation API
- Guides d'installation
- Tutoriels

### Tests
- Tests unitaires
- Tests d'intégration
- Tests de performance
- Tests de sécurité

## 🆘 Obtenir de l'Aide

- 💬 [Discussions GitHub](https://github.com/Naghachmouhsine/clubappbackend/discussions)
- 📧 Email : naghachmouhsine@example.com
- 🐛 [Issues](https://github.com/Naghachmouhsine/clubappbackend/issues)

## 🙏 Remerciements

Merci à tous les contributeurs qui rendent ce projet possible !

---

**Ensemble, construisons la meilleure solution de gestion de club sportif ! 🏃‍♂️⚽**