// Configuration par défaut de l'application
module.exports = {
    // Configuration de la base de données
    database: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/students',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    },
    
    // Configuration du serveur
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost'
    },
    
    // Configuration des sessions
    session: {
        secret: process.env.SESSION_SECRET || 'your-session-secret-here-change-in-production',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // Mettre à true en production avec HTTPS
            httpOnly: true,
            maxAge: 15 * 60 * 1000 // 15 minutes d'inactivité
        }
    },
    
    // Configuration du hachage
    hash: {
        secret: process.env.SECRET_KEY || 'your-secret-key-here-change-in-production',
        algorithm: 'sha256'
    },
    
    // Configuration de l'application
    app: {
        name: 'Application d\'Authentification',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    }
};
