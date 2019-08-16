/**
 * Copyright(c) 2019, prprprus All rights reserved.
 * Use of this source code is governed by a BSD - style.
 * license that can be found in the LICENSE file.
 */

global.__basedir = __dirname;

const express = require('express');
const child_process = require('child_process');
const io = require('../utils/io');
const proc = require('../utils/process');

const argv = process.argv;
const argHost = argv[2];
const argPort = argv[3];
const argChromium = argv[4];
const argSavePath = argv[5];
const scriptPath = argSavePath + '/script.js';
const archivePath = argSavePath + '/../' + 'report.tar.gz';

const app = express();
var recorderPID = undefined;

app.set('views', __basedir + '/../frontend/views');
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.static(__basedir + '/../frontend'));
app.use(express.static(__basedir + '/..'));

app.get('/', (_, res) => {
  res.render('index', {
    host: argHost,
    port: argPort,
    chromium: argChromium,
    savePath: argSavePath
  });
});

app.get('/record', (_, res) => {
  io.createDir(argSavePath);
  if (recorderPID === undefined) {
    io.deleteAllFile(argSavePath);
    io.deleteFile(archivePath);
    const recorder = child_process.spawn('node', [__basedir + '/../core/listener.js', argChromium]);
    // mark recorder is running
    recorderPID = recorder.pid;
    proc.captureLog(recorder);
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
    io.createDir(argSavePath);
    io.writeFile(scriptPath, req.body.statement);
    proc.shutDownRecorder(recorderPID);
    // mark recorder was stopped
    recorderPID = undefined;
    res.sendStatus(200);
  } else {
    res.sendStatus(503);
  }
});

app.get('/play', (_, res) => {
  if (io.isExists(scriptPath)) {
    io.deleteAllFileExceptJS(argSavePath);
    const cmd = child_process.spawnSync(`npm list -g | head -n 1`, {
      shell: true,
      encoding: 'utf8'
    });
    const NODE_PATH = cmd.stdout.replace(/\n|\r/g, "") + '/node_modules';
    const player = child_process.spawn(`export NODE_PATH=${NODE_PATH} && node ${scriptPath}`, {
      shell: true
    });
    proc.captureLog(player);
    res.sendStatus(200);
  } else {
    res.sendStatus(503);
  }
});

app.get('/download', (_, res) => {
  if (io.isExists(archivePath)) {
    res.download(archivePath);
  } else {
    res.sendStatus(503);
  }
});

app.listen(port = argPort, host = argHost, callback = () => {
  console.log('🎉 Running HTTP server successfully');
});