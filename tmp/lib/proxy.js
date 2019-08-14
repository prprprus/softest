/**
 * Copyright(c) 2019, prprprus All rights reserved.
 * Use of this source code is governed by a BSD - style.
 * license that can be found in the LICENSE file.
 */

const WebSocket = require('ws');
const error = require('../utils/error');

/**
 * Class WebSocketServer represents a WebSocket proxy server that
 * forwards messages from the listener to the WebSocket clients.
 */
class WebSocketServer {
  /**
   * Create a WebSocketServer object.
   * 
   * @param {string} host - The host of WebSocketServer.
   * @param {number} port - The port of WebSocketServer.
   * @param {number} backlog - The backlog of WebSocketServer.
   */
  constructor(host = 'localhost', port = 8080, backlog = 511) {
    this._host = host;
    this._port = port;
    this._backlog = backlog;
  }

  get host() {
    return this._host;
  }

  set host(host) {
    if (typeof (host) !== 'string') {
      throw error.hostParam;
    }
    this._host = host;
  }

  get port() {
    return this._port;
  }

  set port(port) {
    if (typeof (port) !== 'number') {
      throw error.portParam;
    }
    this._port = port;
  }

  get backlog() {
    return this._backlog;
  }

  set backlog(backlog) {
    if (typeof (backlog) !== 'number') {
      throw error.backlogParam;
    }
    this._backlog = backlog;
  }

  /**
   * Run proxy server.
   */
  run() {
    const wss = new WebSocket.Server({
      host: this._host,
      port: this._port,
      backlog: this._backlog,
    });
    wss.on('connection', function connection(ws) {
      ws.on('message', function incoming(data) {
        // console.log('received statement: %s', data);
        // boardcast
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            try {
              client.send(data);
            } catch (e) {
              throw e;
            }
          }
        });
      });
    });
    console.log('🎉 proxy server run success');
  }
}

(() => {
  server = new WebSocketServer();
  server.run();
})();

module.exports = {
  WebSocketServer
}