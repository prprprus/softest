const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

/**
 * Connect to WebSocket proxy server.
 */
function init() {
  // connect to statement proxy server
  try {
    ws.on('open', function open() {
      console.log('connected to statement proxy server...');
    });
  } catch (e) {
    throw e;
  }
}

/**
 * Send the data to the proxy server.
 * 
 * @param {string} data - User operation corresponding data.
 */
async function sendData(data) {
  try {
    ws.send(data);
  } catch (e) {
    console.debug('🐞 send error, lose data: ' + e);
    throw e;
  }
}

init();

module.exports = {
  sendData,
}