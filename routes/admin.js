const express = require('express');
const { admin } = require('../controllers/user');
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');

const router = express.Router();

// Route pour la page admin (accessible uniquement aux administrateurs)
router.get('/admin', authMiddleware, adminMiddleware, admin);

module.exports = router;
