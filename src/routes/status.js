const express = require('express');
const { checkConnection } = require('../whatsapp');
const router = express.Router();

// Vérifier l'état de connexion
router.get('/status', (req, res) => {
    const isConnected = checkConnection();
    res.json({ connected: isConnected });
});

module.exports = router;
