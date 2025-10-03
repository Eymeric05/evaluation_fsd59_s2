// Middleware pour vérifier qu'un utilisateur est connecté
const authMiddleware = (req, res, next) => {
    if (req.session && req.session.userId) {
        // L'utilisateur est connecté, on peut continuer
        return next();
    } else {
        // L'utilisateur n'est pas connecté, redirection vers login
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login');
    }
};

module.exports = authMiddleware;
