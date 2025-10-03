# Application d'Authentification et d'Autorisation

Une application Node.js/Express avec MongoDB pour la gestion de l'authentification et de l'autorisation avec gestion des rôles utilisateurs.

## 🚀 Fonctionnalités

- ✅ Inscription et connexion des utilisateurs
- ✅ Hachage des mots de passe avec HMAC SHA-256
- ✅ Gestion des sessions avec expiration automatique (15 min)
- ✅ Système de rôles (user/admin)
- ✅ Pages sécurisées avec middlewares
- ✅ Interface moderne avec Bootstrap
- ✅ Validation des formulaires
- ✅ Messages flash pour les retours utilisateur

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- MongoDB (version 4.4 ou supérieure)
- npm ou yarn

## 🛠️ Installation

1. **Cloner le projet**
   ```bash
   git clone <url-du-repo>
   cd evaluation_fsd59_s2
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   Créez un fichier `.env` à la racine du projet :
   ```env
   MONGODB_URI=mongodb://localhost:27017/students
   SECRET_KEY=your-secret-key-here-change-in-production
   SESSION_SECRET=your-session-secret-here-change-in-production
   PORT=3000
   ```

4. **Démarrer MongoDB**
   Assurez-vous que MongoDB est en cours d'exécution sur votre système.

5. **Créer l'administrateur**
   ```bash
   npm run seed
   ```

6. **Démarrer l'application**
   ```bash
   npm start
   # ou pour le développement
   npm run dev
   ```

## 🔐 Comptes par défaut

Après avoir exécuté le script de seed, vous pouvez vous connecter avec :

- **Email :** admin@example.com
- **Mot de passe :** Admin123!

⚠️ **Important :** Changez ces informations en production !

## 📁 Structure du projet

```
project/
├── controllers/
│   └── user.js              # Contrôleurs pour la gestion des utilisateurs
├── models/
│   └── User.js              # Modèle User avec validation
├── routes/
│   ├── auth.js              # Routes d'authentification
│   ├── dashboard.js         # Routes du dashboard
│   └── admin.js             # Routes d'administration
├── middlewares/
│   ├── auth.js              # Middleware d'authentification
│   └── admin.js             # Middleware d'autorisation admin
├── views/
│   ├── layout.pug           # Layout principal
│   ├── register.pug         # Page d'inscription
│   ├── login.pug            # Page de connexion
│   ├── dashboard.pug       # Dashboard utilisateur
│   ├── admin.pug            # Page d'administration
│   ├── 404.pug              # Page d'erreur 404
│   └── error.pug            # Page d'erreur serveur
├── .env                     # Variables d'environnement
├── server.js                # Serveur principal
├── seed.js                  # Script de création de l'admin
└── package.json             # Dépendances et scripts
```

## 🎯 Routes disponibles

### Routes publiques
- `GET /` - Page d'accueil (redirige vers login si non connecté)
- `GET /register` - Formulaire d'inscription
- `POST /register` - Traitement de l'inscription
- `GET /login` - Formulaire de connexion
- `POST /login` - Traitement de la connexion

### Routes sécurisées
- `GET /dashboard` - Dashboard utilisateur (authentification requise)
- `GET /admin` - Page d'administration (rôle admin requis)
- `GET /logout` - Déconnexion

## 🔒 Sécurité

- **Hachage des mots de passe :** HMAC SHA-256 avec secret
- **Sessions sécurisées :** Stockage en base avec expiration
- **Validation des données :** Express-validator
- **Protection CSRF :** Sessions sécurisées
- **Expiration automatique :** 15 minutes d'inactivité

## 🎨 Interface utilisateur

- **Framework CSS :** Bootstrap 5.3
- **Icônes :** Font Awesome 6.4
- **Design :** Moderne et responsive
- **Couleurs :** Dégradé bleu/violet
- **UX :** Messages flash, validation en temps réel

## 🧪 Validation des mots de passe

Les mots de passe doivent contenir :
- Au moins 8 caractères
- Au moins 1 majuscule
- Au moins 1 chiffre
- Au moins 1 caractère spécial

## 📝 Modèle User

```javascript
{
    firstName: String,     // Prénom (requis)
    lastName: String,      // Nom (requis)
    email: String,         // Email unique (requis)
    password: String,      // Mot de passe haché (requis)
    role: {               // Rôle utilisateur
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}
```

## 🚀 Déploiement

1. Configurez les variables d'environnement pour la production
2. Changez les secrets par défaut
3. Configurez HTTPS pour les sessions sécurisées
4. Utilisez un gestionnaire de processus comme PM2

## 📞 Support

Pour toute question ou problème, consultez la documentation ou contactez l'équipe de développement.

---

**Développé avec ❤️ pour l'évaluation FSD59 S2**
