const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { initWhatsApp } = require('./whatsapp');
const authRoutes = require('./routes/auth');
const sendRoutes = require('./routes/send');
const statusRoutes = require('./routes/status');
const config = require('./config');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/send', sendRoutes);
app.use('/status', statusRoutes);

// Initialisation WhatsApp
initWhatsApp().then(() => {
    console.log('WhatsApp client prêt');
}).catch(err => {
    console.error('Erreur initialisation WhatsApp:', err);
});

// Démarrer le serveur
app.listen(config.PORT, () => {
    console.log(`Serveur en écoute sur le port ${config.PORT}`);
});
