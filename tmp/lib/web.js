const express = require('express');
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
var listenerPID = undefined;
const tmpDir = '/Users/tiger/develop/tmp/report';
const tmpFile = tmpDir + '/script.js';

// configure
app.set('views', '../public/views');
app.set('view engine', 'pug');
app.use(express.static('../public'));
app.use(express.json());
app.use(express.static(__dirname + '../'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/record', (req, res) => {
  // remove file
  fs.readdir(tmpDir, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join(tmpDir, file), err => {
        if (err) throw err;
      });
    }
  });
  if (fs.existsSync('/Users/tiger/develop/tmp/report.tar.gz')) {
    fs.unlink('/Users/tiger/develop/tmp/report.tar.gz', err => {
      if (err) throw err;
    });
  }

  const listener = child_process.spawn('node', ['/Users/tiger/develop/tmp/lib/listener.js', ]);
  listenerPID = listener.pid;
  listener.stdout.on('data', (data) => {
    console.log(`${listener.pid} stdout: ${data}`);
  });

  listener.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  listener.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
  res.send('/record');
});

app.get('/screenshot', (req, res) => {
  res.send('/screenshot');
});

app.get('/full', (req, res) => {
  res.send('/full');
});

app.post('/end', (req, res) => {
  if (!fs.existsSync(tmpDir)) {
    console.log('The file does not exists.');
    fs.mkdir(tmpDir, function (err) {
      if (err) {
        throw err;
      }
    });
  }
  fs.open(tmpFile, 'w+', function (err, fd) {
    if (err) {
      throw err;
    }
    fs.write(fd, req.body.code, function (err, written, string) {
      if (err) {
        throw err;
      }

      // todo: verify written and string

      fs.close(fd, function (err) {
        if (err) {
          throw err;
        }
      });
    })
  });
  if (listenerPID !== undefined) {
    process.kill(listenerPID, 'SIGINT');
  }
  res.send('/end');
});

app.get('/play', (req, res) => {
  const play = child_process.spawn('node', [tmpFile, ]);
  play.stdout.on('data', (data) => {
    console.log(`${play.pid} stdout: ${data}`);
  });

  play.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  play.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
  res.send('/play');
});

app.get('/download', (req, res) => {
  const file = `${__dirname}/../report.tar.gz`;
  res.download(file);
});

// run
app.listen(port, () => {
  console.log(`Softest listening on port ${port}!`);
});