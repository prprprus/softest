const proxy = require('./lib/proxy');

server = new proxy.WebSocketServer();
server.runStatementProxy();