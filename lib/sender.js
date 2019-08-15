/**
 * Copyright(c) 2019, prprprus All rights reserved.
 * Use of this source code is governed by a BSD - style.
 * license that can be found in the LICENSE file.
 */

const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

/**
 * Send the data to the proxy server.
 * 
 * @param {string} data - Data to be sent.
 */
async function sendData(data) {
  try {
    ws.send(data);
  } catch (e) {
    throw e;
  }
}

// Connect to WebSocket proxy server.
(() => {
  ws.on('open', function open() {
    console.log('🎉 connect the proxy server success');
  });
})();

module.exports = {
  sendData,
}