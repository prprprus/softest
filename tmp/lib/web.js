/**
 * Copyright(c) 2019, prprprus All rights reserved.
 * Use of this source code is governed by a BSD - style.
 * license that can be found in the LICENSE file.
 */

const express = require('express');
const child_process = require('child_process');
const common = require('../utils/common');
const io = require('../utils/io');

const app = express();
const port = 3000;
var recorderPID = undefined;
const tmpDir = '/Users/tiger/develop/tmp/report';
const tmpFile = tmpDir + '/script.js';

// configure
app.set('views', '../public/views');
app.set('view engine', 'pug');
app.use(express.static('../public'));
app.use(express.json());
app.use(express.static(__dirname + '../'));

app.get('/', (_, res) => {
  res.render('index');
});

app.get('/record', (_, res) => {
  io.createDir(tmpDir);
  // Make sure there is only one recoder
  if (recorderPID === undefined) {
    // delete old report dir
    io.deleteAllFile(tmpDir);
    // delete old archive
    io.deleteFile('/Users/tiger/develop/tmp/report.tar.gz');
    // run recorder
    const recorder = child_process.spawn('node', ['/Users/tiger/develop/tmp/lib/listener.js', ]);
    // mark recorder is running
    recorderPID = recorder.pid;
    recorder.stdout.on('data', (data) => {
      console.log(`${common.getCurrentDateTime()} ${recorder.pid} stdout: ${data}`);
    });
    recorder.stderr.on('data', (data) => {
      console.log(`${common.getCurrentDateTime()} ${recorder.pid} stderr: ${data}`);
    });
    recorder.on('close', (code) => {
      console.log(`${common.getCurrentDateTime()} ${recorder.pid} close: process exited with code ${code}`);
    });
    res.sendStatus(200);
  } else {
    res.sendStatus(503);
  }
});

app.get('/screenshot', (_, res) => {
  if (recorderPID !== undefined) {
    res.sendStatus(200);
  } else {
    res.sendStatus(503);
  }
});

app.post('/end', (req, res) => {
  if (recorderPID !== undefined) {
    io.createDir(tmpDir);
    io.writeFile(tmpFile, req.body.statement);
    common.shutDownRecorder(recorderPID);
    // mark recorder was stopped
    recorderPID = undefined;
    res.sendStatus(200);
  } else {
    res.sendStatus(503);
  }
});

app.get('/play', (_, res) => {
  if (io.isExists(tmpFile)) {
    const play = child_process.spawn('node', [tmpFile, ]);
    play.stdout.on('data', (data) => {
      console.log(`${common.getCurrentDateTime()} ${play.pid} stdout: ${data}`);
    });
    play.stderr.on('data', (data) => {
      console.log(`${common.getCurrentDateTime()} ${play.pid} stderr: ${data}`);
    });
    play.on('close', (code) => {
      console.log(`${common.getCurrentDateTime()} ${play.pid} process exited with code ${code}`);
    });
    res.sendStatus(200);
  } else {
    res.sendStatus(503);
  }
});

app.get('/download', (_, res) => {
  const file = `${__dirname}/../report.tar.gz`;
  if (io.isExists(file)) {
    res.download(file);
  } else {
    res.sendStatus(503);
  }
});

/**
 * Run the http server.
 */
app.listen(port, () => {
  console.log(`🎉 Softest is running, listening on port ${port}!`);
});