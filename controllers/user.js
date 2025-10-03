const User = require('../models/User');
const { validationResult } = require('express-validator');

// Fonction pour valider la force du mot de passe
const validatePasswordStrength = (password) => {
    const errors = [];
    
    if (password.length < 8) {
        errors.push('Le mot de passe doit contenir au moins 8 caractères');
    }
    
    if (!/[A-Z]/.test(password)) {
        errors.push('Le mot de passe doit contenir au moins une majuscule');
    }
    
    if (!/\d/.test(password)) {
        errors.push('Le mot de passe doit contenir au moins un chiffre');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Le mot de passe doit contenir au moins un caractère spécial');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

// Contrôleur pour l'inscription
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body;
        
        // Vérification des erreurs de validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('register', {
                errors: errors.array(),
                formData: req.body
            });
        }

        // Vérification que tous les champs sont remplis
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.render('register', {
                error: 'Tous les champs sont requis',
                formData: req.body
            });
        }

        // Vérification que les mots de passe correspondent
        if (password !== confirmPassword) {
            return res.render('register', {
                error: 'Les mots de passe ne correspondent pas',
                formData: req.body
            });
        }

        // Validation de la force du mot de passe
        const passwordValidation = validatePasswordStrength(password);
        if (!passwordValidation.isValid) {
            return res.render('register', {
                error: passwordValidation.errors.join(', '),
                formData: req.body
            });
        }

        // Vérification que l'utilisateur n'existe pas déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('register', {
                error: 'Un utilisateur avec cet email existe déjà',
                formData: req.body
            });
        }

        // Création du nouvel utilisateur
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            role: 'user' // Seuls les utilisateurs normaux peuvent s'inscrire
        });

        await newUser.save();

        req.flash('success', 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
        res.redirect('/login');

    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.render('register', {
            error: 'Une erreur est survenue lors de la création du compte',
            formData: req.body
        });
    }
};

// Contrôleur pour la connexion
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérification des erreurs de validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('login', {
                errors: errors.array(),
                formData: req.body
            });
        }

        // Vérification que les champs sont remplis
        if (!email || !password) {
            return res.render('login', {
                error: 'Email et mot de passe sont requis',
                formData: req.body
            });
        }

        // Recherche de l'utilisateur
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', {
                error: 'Email ou mot de passe incorrect',
                formData: req.body
            });
        }

        // Vérification du mot de passe
        if (!user.comparePassword(password)) {
            return res.render('login', {
                error: 'Email ou mot de passe incorrect',
                formData: req.body
            });
        }

        // Connexion réussie - création de la session
        req.session.userId = user._id;
        req.session.userRole = user.role;
        
        req.flash('success', `Bienvenue ${user.firstName} !`);
        
        // Redirection vers la page demandée ou dashboard
        const returnTo = req.session.returnTo || '/dashboard';
        delete req.session.returnTo;
        res.redirect(returnTo);

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.render('login', {
            error: 'Une erreur est survenue lors de la connexion',
            formData: req.body
        });
    }
};

// Contrôleur pour la déconnexion
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la déconnexion:', err);
        }
        res.redirect('/login');
    });
};

// Contrôleur pour afficher le dashboard
const dashboard = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        res.render('dashboard', { user });
    } catch (error) {
        console.error('Erreur lors du chargement du dashboard:', error);
        req.flash('error', 'Une erreur est survenue lors du chargement du dashboard');
        res.redirect('/login');
    }
};

// Contrôleur pour afficher la page admin
const admin = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.render('admin', { users, currentUser: req.user });
    } catch (error) {
        console.error('Erreur lors du chargement de la page admin:', error);
        req.flash('error', 'Une erreur est survenue lors du chargement de la page admin');
        res.redirect('/dashboard');
    }
};

module.exports = {
    register,
    login,
    logout,
    dashboard,
    admin
};
