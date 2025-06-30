const express = require('express');
const { getQRCode } = require('../whatsapp');
const router = express.Router();

// Générer le QR Code
router.get('/qr', async (req, res) => {
    try {
        const qrImage = await getQRCode();
        res.json({ qr: qrImage });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
