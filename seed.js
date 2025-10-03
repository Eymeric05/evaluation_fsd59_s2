const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/students');
        console.log('✅ Connexion à MongoDB réussie');

        // Vérifier si un admin existe déjà
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('⚠️  Un administrateur existe déjà dans la base de données');
            console.log(`📧 Email: ${existingAdmin.email}`);
            return;
        }

        // Créer l'administrateur
        const admin = new User({
            firstName: 'Admin',
            lastName: 'System',
            email: 'admin@example.com',
            password: 'Admin123!', // Le mot de passe sera automatiquement haché
            role: 'admin'
        });

        await admin.save();
        console.log('✅ Administrateur créé avec succès');
        console.log('📧 Email: admin@example.com');
        console.log('🔑 Mot de passe: Admin123!');
        console.log('⚠️  N\'oubliez pas de changer ces informations en production !');

    } catch (error) {
        console.error('❌ Erreur lors de la création de l\'administrateur:', error);
    } finally {
        // Fermer la connexion
        await mongoose.connection.close();
        console.log('🔌 Connexion fermée');
        process.exit(0);
    }
};

// Exécuter le script
seedAdmin();
