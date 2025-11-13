import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import leoProfanity from 'leo-profanity';
import { generateMessage, generateLocationMessage } from './utils/messages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, '../public')));

// Load English profanity dictionary
leoProfanity.loadDictionary();

io.on('connection', (socket) => {
  console.log('✅ New connection');

  // Welcome user
  socket.emit('message', generateMessage('Welcome to the chat!'));

  // Notify others
  socket.broadcast.emit('message', generateMessage('A new user joined.'));

  // Handle normal messages
  socket.on('sendMessage', (message, callback) => {
    const cleaned = leoProfanity.clean(message);
    io.emit('message', generateMessage(cleaned));

    callback(
      leoProfanity.check(message)
        ? '⚠️ Message cleaned for profanity.'
        : '✅ Message delivered.'
    );
  });

  // Handle location sharing
  socket.on('sendLocation', (coords, callback) => {
    const locationUrl = `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
    io.emit('locationMessage', generateLocationMessage(locationUrl));
    callback('✅ Location shared!');
  });

  socket.on('disconnect', () => {
    io.emit('message', generateMessage('A user has left.'));
  });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
