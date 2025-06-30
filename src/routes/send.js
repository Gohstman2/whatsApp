const express = require('express');
const { sendMessage } = require('../whatsapp');
const router = express.Router();

// Envoyer un message
router.post('/send', async (req, res) => {
    const { to, message } = req.body;
    
    if (!to || !message) {
        return res.status(400).json({ error: 'Paramètres "to" et "message" requis' });
    }

    try {
        const result = await sendMessage(to, message);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
