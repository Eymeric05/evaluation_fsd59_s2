# Guide d'utilisation - Application d'Authentification

## 🚀 Démarrage rapide

### 1. Prérequis
- Node.js (version 14+)
- MongoDB (version 4.4+)
- npm ou yarn

### 2. Installation
```bash
# Cloner le projet
git clone <url-du-repo>
cd evaluation_fsd59_s2

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp env.example .env

# Éditer les variables d'environnement si nécessaire
# (Les valeurs par défaut fonctionnent pour le développement)
```

### 3. Configuration de MongoDB
Assurez-vous que MongoDB est démarré :
```bash
# Sur Windows
net start MongoDB

# Sur macOS/Linux
sudo systemctl start mongod
# ou
mongod
```

### 4. Création de l'administrateur
```bash
npm run seed
```

### 5. Démarrage de l'application
```bash
npm start
# ou pour le développement avec rechargement automatique
npm run dev
```

## 🔐 Comptes de test

### Administrateur (créé par le seed)
- **Email :** admin@example.com
- **Mot de passe :** Admin123!

### Créer un utilisateur normal
1. Aller sur http://localhost:3000/register
2. Remplir le formulaire d'inscription
3. Se connecter avec les identifiants créés

## 📱 Utilisation de l'application

### 1. Page d'accueil (/)
- Redirige vers /login si non connecté
- Redirige vers /dashboard si connecté

### 2. Inscription (/register)
- Formulaire avec validation complète
- Vérification de la force du mot de passe
- Vérification de l'unicité de l'email

### 3. Connexion (/login)
- Authentification par email/mot de passe
- Redirection vers la page demandée après connexion

### 4. Dashboard (/dashboard)
- Accessible aux utilisateurs connectés
- Affichage des informations personnelles
- Liens vers l'administration (si admin)

### 5. Administration (/admin)
- Accessible uniquement aux administrateurs
- Liste de tous les utilisateurs
- Statistiques de l'application

## 🛠️ Scripts disponibles

```bash
# Démarrage normal
npm start

# Développement avec rechargement
npm run dev

# Création de l'admin
npm run seed

# Test de configuration
node test-setup.js
```

## 🔧 Configuration avancée

### Variables d'environnement (.env)
```env
# Base de données
MONGODB_URI=mongodb://localhost:27017/students

# Sécurité
SECRET_KEY=your-secret-key-here
SESSION_SECRET=your-session-secret-here

# Serveur
PORT=3000
```

### Personnalisation
- **Design :** Modifiez les fichiers dans `views/`
- **Logique :** Modifiez les contrôleurs dans `controllers/`
- **Routes :** Ajoutez des routes dans `routes/`
- **Validation :** Ajustez les règles dans les modèles

## 🐛 Dépannage

### Problème de connexion MongoDB
```bash
# Vérifier que MongoDB est démarré
mongosh --eval "db.runCommand('ping')"

# Redémarrer MongoDB
sudo systemctl restart mongod
```

### Erreur de dépendances
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Problème de session
- Vérifiez que les variables d'environnement sont correctes
- Assurez-vous que MongoDB est accessible
- Vérifiez les logs du serveur

## 📊 Fonctionnalités implémentées

### ✅ Authentification
- [x] Inscription avec validation
- [x] Connexion sécurisée
- [x] Déconnexion
- [x] Sessions avec expiration

### ✅ Autorisation
- [x] Middleware d'authentification
- [x] Middleware d'administration
- [x] Gestion des rôles
- [x] Protection des routes

### ✅ Sécurité
- [x] Hachage HMAC SHA-256
- [x] Validation des données
- [x] Sessions sécurisées
- [x] Protection CSRF

### ✅ Interface
- [x] Design responsive Bootstrap
- [x] Messages flash
- [x] Validation en temps réel
- [x] Navigation intuitive

## 🚀 Déploiement

### Production
1. Configurez les variables d'environnement
2. Changez les secrets par défaut
3. Configurez HTTPS
4. Utilisez un gestionnaire de processus (PM2)

### Docker (optionnel)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📞 Support

Pour toute question :
1. Consultez les logs du serveur
2. Vérifiez la configuration MongoDB
3. Testez avec les comptes par défaut
4. Consultez la documentation Express/MongoDB

---

**Application développée pour l'évaluation FSD59 S2** 🎓
