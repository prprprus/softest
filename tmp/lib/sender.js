const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

async function sendData(data) {
  ws.on('open', function open() {
    console.log('connected to wss...');
  });
  // send data to wss
  ws.send(data);
}

module.exports = {
  sendData
}