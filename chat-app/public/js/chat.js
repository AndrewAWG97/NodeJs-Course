// ============================================
// 💬 Chat Client Script
// ============================================

// Connect to backend server
const socket = io();

// DOM elements
const form = document.querySelector('#message-form');
const input = form.querySelector('input');
const sendButton = form.querySelector('button');
const statusElement = document.querySelector('#status');
const messages = document.querySelector('#messages');
const sendLocation = document.querySelector('#send-location');
const locationStatus = document.querySelector('#location-status');

// Mustache template for messages
const messageTemplate = document.querySelector('#message-template').innerHTML;

// ============================================
// 📩 Receive and Render Messages
// ============================================
socket.on('message', (message) => {
  let username = 'Unknown';
  if (message.senderId === 'Server') username = 'Server';
  else if (message.senderId) username = `User ${message.senderId.slice(0, 5)}`;

  const time = moment(message.createdAt).format('h:mm a');

  const html = Mustache.render(messageTemplate, {
    username,
    text: message.text,
    createdAt: time,
  });

  messages.insertAdjacentHTML('beforeend', html);
  messages.scrollTop = messages.scrollHeight;
});

// ============================================
// 📨 Send Message
// ============================================
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const message = input.value.trim();
  if (!message) return;

  sendButton.disabled = true;
  sendButton.textContent = 'Sending...';

  socket.emit('sendMessage', message, (ackMessage) => {
    sendButton.disabled = false;
    sendButton.textContent = 'Send';
    input.value = '';
    input.focus();

    statusElement.textContent = ackMessage;
    statusElement.style.color = ackMessage.includes('⚠️') ? 'orange' : 'green';
    setTimeout(() => (statusElement.textContent = ''), 2500);
  });
});

// ============================================
// 📍 Send Location
// ============================================
sendLocation.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser.');
  }

  sendLocation.disabled = true;
  sendLocation.textContent = 'Sending location...';

  navigator.geolocation.getCurrentPosition((position) => {
    const coords = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    socket.emit('sendLocation', coords, (ackMessage) => {
      sendLocation.disabled = false;
      sendLocation.textContent = 'Send Location';
      locationStatus.textContent = ackMessage;
      locationStatus.style.color = 'green';
      setTimeout(() => (locationStatus.textContent = ''), 2500);
    });
  });
});
