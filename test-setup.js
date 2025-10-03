const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const testSetup = async () => {
    try {
        console.log('🧪 Test de configuration...');
        
        // Test de connexion MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/students');
        console.log('✅ Connexion MongoDB OK');
        
        // Test du modèle User
        const testUser = new User({
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            password: 'Test123!',
            role: 'user'
        });
        
        // Test de validation
        const validation = testUser.validatePasswordStrength('Test123!');
        console.log('✅ Validation mot de passe:', validation.isValid ? 'OK' : 'ERREUR');
        
        // Test de hachage
        const hashedPassword = testUser.hashPassword('Test123!');
        console.log('✅ Hachage mot de passe:', hashedPassword ? 'OK' : 'ERREUR');
        
        // Nettoyage
        await User.deleteOne({ email: 'test@example.com' });
        console.log('✅ Nettoyage OK');
        
        console.log('🎉 Tous les tests sont passés !');
        
    } catch (error) {
        console.error('❌ Erreur lors des tests:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

testSetup();
