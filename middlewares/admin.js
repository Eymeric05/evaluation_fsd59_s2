const User = require('../models/User');

// Middleware pour vérifier que l'utilisateur connecté a le rôle admin
const adminMiddleware = async (req, res, next) => {
    try {
        if (!req.session || !req.session.userId) {
            return res.redirect('/login');
        }

        // Récupérer l'utilisateur depuis la base de données
        const user = await User.findById(req.session.userId);
        
        if (!user) {
            req.session.destroy();
            return res.redirect('/login');
        }

        if (user.role !== 'admin') {
            // L'utilisateur n'est pas admin, redirection vers dashboard
            req.flash('error', 'Accès refusé. Vous devez être administrateur pour accéder à cette page.');
            return res.redirect('/dashboard');
        }

        // L'utilisateur est admin, on peut continuer
        req.user = user;
        next();
    } catch (error) {
        console.error('Erreur dans adminMiddleware:', error);
        req.flash('error', 'Une erreur est survenue lors de la vérification des permissions.');
        return res.redirect('/dashboard');
    }
};

module.exports = adminMiddleware;
