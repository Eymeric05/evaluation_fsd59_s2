#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Démarrage de l\'application d\'authentification...\n');

// Vérifier si MongoDB est disponible
const checkMongoDB = () => {
    return new Promise((resolve) => {
        const mongoose = require('mongoose');
        mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/students')
            .then(() => {
                console.log('✅ MongoDB est disponible');
                mongoose.connection.close();
                resolve(true);
            })
            .catch(() => {
                console.log('❌ MongoDB n\'est pas disponible');
                console.log('💡 Assurez-vous que MongoDB est démarré sur votre système');
                resolve(false);
            });
    });
};

// Fonction principale
const start = async () => {
    console.log('🔍 Vérification des prérequis...');
    
    // Vérifier MongoDB
    const mongoAvailable = await checkMongoDB();
    if (!mongoAvailable) {
        console.log('\n❌ Impossible de démarrer sans MongoDB');
        process.exit(1);
    }
    
    console.log('\n📦 Installation des dépendances...');
    const install = spawn('npm', ['install'], { 
        stdio: 'inherit',
        shell: true 
    });
    
    install.on('close', (code) => {
        if (code !== 0) {
            console.log('❌ Erreur lors de l\'installation des dépendances');
            process.exit(1);
        }
        
        console.log('\n🌱 Création de l\'administrateur...');
        const seed = spawn('node', ['seed.js'], { 
            stdio: 'inherit',
            shell: true 
        });
        
        seed.on('close', (seedCode) => {
            console.log('\n🎯 Démarrage du serveur...');
            const server = spawn('node', ['server.js'], { 
                stdio: 'inherit',
                shell: true 
            });
            
            server.on('close', (serverCode) => {
                console.log('\n👋 Arrêt de l\'application');
            });
        });
    });
};

// Gestion des erreurs
process.on('uncaughtException', (error) => {
    console.error('❌ Erreur non gérée:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesse rejetée:', reason);
    process.exit(1);
});

// Démarrer l'application
start();
