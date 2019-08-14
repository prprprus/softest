#!/usr/bin/env node

const program = require('commander');
const child_process = require('child_process');
const common = require('./utils/common');

const cliProxy = child_process.spawn('node', ['./lib/proxy.js', '&']);
common.captureLog(cliProxy);
const cliRecoder = child_process.spawn('node', ['./lib/web.js', ]);
common.captureLog(cliRecoder);


console.log(`
 _______  _______  _______  _______  _______  _______  _______ 
|       ||       ||       ||       ||       ||       ||       |     status: running
|  _____||   _   ||    ___||_     _||    ___||  _____||_     _|     host: localhost
| |_____ |  | |  ||   |___   |   |  |   |___ | |_____   |   |       port: 3000
|_____  ||  |_|  ||    ___|  |   |  |    ___||_____  |  |   |  
 _____| ||       ||   |      |   |  |   |___  _____| |  |   |  
|_______||_______||___|      |___|  |_______||_______|  |___|  
`);