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
   * @param {string} host - Host of WebSocketServer.
   * @param {number} port - Port of WebSocketServer.
   * @param {number} backlog - backlog of WebSocketServer.
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
    // todo: more in-depth backlog control
    if (typeof (backlog) !== 'number') {
      throw error.backlogParam;
    }
    this._backlog = backlog;
  }

  /**
   * Run the WebSocket server.
   * It waits for the listener's message and broadcasts it to all WebSocket clients.
   */
  run() {
    const wss = new WebSocket.Server({
      host: this._host,
      port: this._port,
      backlog: this._backlog,
    });

    // receive and boadcast
    wss.on('connection', function connection(ws) {
      ws.on('message', function incoming(data) {
        console.log('received data from demo.js: %s', data);
        console.log(wss.clients.size);
        wss.clients.forEach(function each(client) {
          console.log('send data to wsc of page...');
          if (client.readyState === WebSocket.OPEN) {
            client.send(data);
          }
        });
      });
    });
  }
}

module.exports = {
  WebSocketServer
}

// tmp, run wss
server = new WebSocketServer();
server.run();