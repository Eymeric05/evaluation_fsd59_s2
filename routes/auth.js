const express = require('express');
const { body } = require('express-validator');
const { register, login, logout } = require('../controllers/user');

const router = express.Router();

// Validation pour l'inscription
const registerValidation = [
    body('firstName')
        .notEmpty()
        .withMessage('Le prénom est requis')
        .trim(),
    body('lastName')
        .notEmpty()
        .withMessage('Le nom est requis')
        .trim(),
    body('email')
        .isEmail()
        .withMessage('Veuillez entrer un email valide')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Le mot de passe doit contenir au moins 8 caractères'),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Les mots de passe ne correspondent pas');
            }
            return true;
        })
];

// Validation pour la connexion
const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Veuillez entrer un email valide')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Le mot de passe est requis')
];

// Route pour afficher le formulaire d'inscription
router.get('/register', (req, res) => {
    res.render('register', { formData: {} });
});

// Route pour traiter l'inscription
router.post('/register', registerValidation, register);

// Route pour afficher le formulaire de connexion
router.get('/login', (req, res) => {
    res.render('login', { formData: {} });
});

// Route pour traiter la connexion
router.post('/login', loginValidation, login);

// Route pour la déconnexion
router.get('/logout', logout);

module.exports = router;
