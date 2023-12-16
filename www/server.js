const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mqtt = require('mqtt');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Statische Dateien aus dem 'public'-Verzeichnis bedienen
app.use(express.static(path.join(__dirname, 'public')));

// MQTT-Client
const mqttClient = mqtt.connect('mqtt://localhost');
const topics = ['edu/team1', 'edu/team2', 'edu/team3', 'edu/team4', 'edu/team5'];
mqttClient.subscribe(topics);

// Wenn eine MQTT-Nachricht empfangen wird
mqttClient.on('message', (topic, message) => {
    const msg = message.toString();
    if (topic === 'edu/team5') {
        if (parseInt(msg) > 500) {
            io.emit('trunk_opened'); // Sendet ein Ereignis, um die Truhe zu öffnen
        }
    } else {
        if (parseInt(msg) > 12) {
            io.emit('mqtt_message', { topic, message: msg });
        }
    }
});

// Bedienen der HTML-Seite
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Starten des Servers
server.listen(3001, () => {
    console.log('Server läuft auf Port 3001');
});
