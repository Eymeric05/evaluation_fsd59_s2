const express = require('express');
const { dashboard } = require('../controllers/user');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Route pour le dashboard (accessible aux utilisateurs connectés)
router.get('/dashboard', authMiddleware, dashboard);

module.exports = router;
