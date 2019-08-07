const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

/**
 * Connect to WebSocket proxy server.
 */
function init() {
  try {
    ws.on('open', function open() {
      console.log('connected to wss...');
    });
  } catch (e) {
    throw e;
  }
}

/**
 * Send the statement corresponding to the user operation to the WebSocket proxy server.
 * 
 * @param {string} data - User operation corresponding statement.
 */
async function sendData(data) {
  try {
    ws.send(data);
  } catch (e) {
    console.debug('🐞 send error, lose statement: ' + e);
    throw e;
  }
}

init();

module.exports = {
  sendData
}