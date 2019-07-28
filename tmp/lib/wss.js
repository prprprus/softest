const WebSocket = require('ws');

class WebSocketServer {
  constructor(host = 'localhost', port = 8080, backlog = 511) {
    this._host = host;
    this._port = port;
    this._backlog = backlog;
  }

  get host() {
    return this._host;
  }

  set host(host) {
    this._host = host;
  }

  get port() {
    return this._port;
  }

  set port(port) {
    this._port = port;
  }

  get backlog() {
    return this._backlog;
  }

  set backlog(backlog) {
    this._backlog = backlog;
  }

  run() {
    // new instance
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

// run wss
server = new WebSocketServer();
server.run();