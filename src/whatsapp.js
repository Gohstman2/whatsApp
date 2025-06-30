const { makeWASocket, useMultiFileAuthState, delay } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode');
const path = require('path');
const fs = require('fs');
const config = require('./config');

let client = null;
let qrCode = null;
let isConnected = false;

// Initialiser le client WhatsApp
async function initWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState(config.SESSION_PATH);
    
    client = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    });

    // Gestion des événements
    client.ev.on('connection.update', (update) => {
        const { connection, qr } = update;
        
        if (qr) {
            qrCode = qr;
            console.log('Nouveau QR Code généré');
        }

        if (connection === 'open') {
            isConnected = true;
            console.log('Connecté à WhatsApp');
        } else if (connection === 'close') {
            isConnected = false;
            console.log('Déconnecté de WhatsApp');
        }
    });

    client.ev.on('creds.update', saveCreds);

    return client;
}

// Obtenir le QR Code
async function getQRCode() {
    if (!qrCode) {
        throw new Error('Aucun QR Code disponible');
    }
    
    try {
        const qrImage = await qrcode.toDataURL(qrCode);
        return qrImage;
    } catch (err) {
        throw new Error('Erreur génération QR Code');
    }
}

// Vérifier l'état de connexion
function checkConnection() {
    return isConnected;
}

// Envoyer un message
async function sendMessage(to, message) {
    if (!isConnected) {
        throw new Error('Non connecté à WhatsApp');
    }

    try {
        const jid = to.includes('@') ? to : `${to}@s.whatsapp.net`;
        await client.sendMessage(jid, { text: message });
        return { success: true, message: 'Message envoyé' };
    } catch (err) {
        throw new Error(`Erreur envoi message: ${err.message}`);
    }
}

module.exports = {
    initWhatsApp,
    getQRCode,
    checkConnection,
    sendMessage
};
