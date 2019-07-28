const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

async function sendData(page, data) {
  // send data to wss
  ws.on('open', function open() {
    console.log('connected to wss...');
  });
  ws.send(data);
  await page.waitFor(500);
}

module.exports = {
  sendData
}