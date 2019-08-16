#!/usr/bin/env node

/**
 * Copyright(c) 2019, prprprus All rights reserved.
 * Use of this source code is governed by a BSD - style.
 * license that can be found in the LICENSE file.
 */

global.__basedir = __dirname;

const commander = require('commander');
const child_process = require('child_process');
const proc = require(__basedir + '/src/utils/process');

const program = new commander.Command();

/**
 * Run softest.
 * 
 * @param {string} host - Server hostname (default: 127.0.0.1).
 * @param {number} port - Server port (default: 2333).
 * @param {string} chromium - The absolute path of the chromium execution file.
 * @param {string} savePath - Test report save path.
 */
function run(host, port, chromium, savePath) {
  // For wss.js and web.js, their relative paths are for index.js.
  const cliProxy = child_process.spawn('node', ['./src/server/wss.js', '&']);
  proc.captureLog(cliProxy);
  const cliRecoder = child_process.spawn('node', ['./src/server/web.js', host, port, chromium, savePath]);
  proc.captureLog(cliRecoder);

  console.log(`
 _______  _______  _______  _______  _______  _______  _______ 
|       ||       ||       ||       ||       ||       ||       |     status: running
|  _____||   _   ||    ___||_     _||    ___||  _____||_     _|     host: ${host}
| |_____ |  | |  ||   |___   |   |  |   |___ | |_____   |   |       port: ${port}
|_____  ||  |_|  ||    ___|  |   |  |    ___||_____  |  |   |  
 _____| ||       ||   |      |   |  |   |___  _____| |  |   |  
|_______||_______||___|      |___|  |_______||_______|  |___|  
`);
}

program
  .option('-h, --host <type>', 'Server hostname (default: 127.0.0.1).', '127.0.0.1')
  .option('-p, --port <type>', 'Server port (default: 2333).', 2333)
  .option('-c, --chromium <type>', 'The absolute path of the chromium execution file.')
  .option('-s, --save <type>', 'Test report save path.');

program.parse(process.argv);
run(program.host, program.port, program.chromium, program.save);