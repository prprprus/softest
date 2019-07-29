const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
  console.log('connected to wss...');
});

async function sendData(data) {
  ws.send(data);
}

module.exports = {
  sendData
}