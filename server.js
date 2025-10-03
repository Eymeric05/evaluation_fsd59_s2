const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
require('dotenv').config();

// Import des routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration de la base de données
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/students', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ Connexion à MongoDB réussie');
})
.catch((error) => {
    console.error('❌ Erreur de connexion à MongoDB:', error);
    process.exit(1);
});

// Configuration du moteur de template
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour parser les données
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuration des sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret-here',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/students',
        touchAfter: 24 * 3600 // Lazy session update
    }),
    cookie: {
        secure: false, // Mettre à true en production avec HTTPS
        httpOnly: true,
        maxAge: 15 * 60 * 1000 // 15 minutes d'inactivité
    }
}));

// Middleware pour les flash messages
app.use((req, res, next) => {
    // Initialiser les messages flash
    if (!req.session.messages) {
        req.session.messages = { success: [], error: [], info: [] };
    }
    
    // Rendre les messages disponibles dans les templates
    res.locals.messages = req.session.messages;
    res.locals.user = req.session.userId ? { id: req.session.userId, role: req.session.userRole } : null;
    
    // Méthode flash pour ajouter des messages
    req.flash = (type, message) => {
        if (!req.session.messages[type]) {
            req.session.messages[type] = [];
        }
        req.session.messages[type].push(message);
    };
    
    // Méthode pour nettoyer les messages après affichage
    res.locals.clearMessages = () => {
        req.session.messages = { success: [], error: [], info: [] };
    };
    
    // Nettoyer les messages après chaque requête GET
    const originalRender = res.render;
    res.render = function(view, options = {}) {
        // Nettoyer les messages après le rendu
        setTimeout(() => {
            if (req.session.messages) {
                req.session.messages = { success: [], error: [], info: [] };
            }
        }, 100);
        return originalRender.call(this, view, options);
    };
    
    next();
});

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/', adminRoutes);

// Route d'accueil
app.get('/', (req, res) => {
    if (req.session && req.session.userId) {
        return res.redirect('/dashboard');
    }
    res.render('login', { formData: {} });
});

// Middleware de gestion des erreurs 404
app.use((req, res, next) => {
    res.status(404).render('404', { 
        title: 'Page non trouvée',
        message: 'La page que vous recherchez n\'existe pas.'
    });
});

// Middleware de gestion des erreurs
app.use((error, req, res, next) => {
    console.error('Erreur:', error);
    res.status(500).render('error', {
        title: 'Erreur serveur',
        message: 'Une erreur interne du serveur s\'est produite.'
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`🌐 Accédez à l'application sur http://localhost:${PORT}`);
    console.log('📝 Pour créer un administrateur, exécutez: npm run seed');
});

// Gestion propre de l'arrêt du serveur
process.on('SIGINT', async () => {
    console.log('\n🛑 Arrêt du serveur...');
    await mongoose.connection.close();
    console.log('✅ Connexion à la base de données fermée');
    process.exit(0);
});
