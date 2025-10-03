const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Le prénom est requis'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Le nom est requis'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'L\'email est requis'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez entrer un email valide']
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est requis'],
        minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true
});

// Méthode pour hasher le mot de passe avec HMAC SHA-256
userSchema.methods.hashPassword = function(password) {
    const secret = process.env.SECRET_KEY || 'default-secret';
    return crypto.createHmac('sha256', secret).update(password).digest('hex');
};

// Méthode pour vérifier le mot de passe
userSchema.methods.comparePassword = function(candidatePassword) {
    // Si le mot de passe stocké n'est pas encore haché, le hasher
    if (!this.password.startsWith('$')) {
        const hashedPassword = this.hashPassword(candidatePassword);
        return this.password === hashedPassword;
    }
    // Si le mot de passe est déjà haché, comparer directement
    return this.password === this.hashPassword(candidatePassword);
};

// Middleware pre-save pour hasher le mot de passe avant sauvegarde
userSchema.pre('save', function(next) {
    if (this.isModified('password') && !this.password.startsWith('$')) {
        // Vérifier si le mot de passe n'est pas déjà haché
        this.password = this.hashPassword(this.password);
    }
    next();
});

// Méthode pour valider la force du mot de passe
userSchema.methods.validatePasswordStrength = function(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
        isValid: password.length >= minLength && hasUpperCase && hasNumbers && hasSpecialChar,
        errors: []
    };
};

module.exports = mongoose.model('User', userSchema);
