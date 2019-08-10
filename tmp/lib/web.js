const express = require('express');
const child_process = require('child_process');
const fs = require('fs');

const app = express();
const port = 3000;
var listenerPID = undefined;
const tmpDir = '/Users/tiger/develop/tmp/script';
const tmpFile = tmpDir + '/script.js';

// configure
app.set('views', '../public/views');
app.set('view engine', 'pug');
app.use(express.static('../public'));
app.use(express.json());


app.get('/', (req, res) => {
  res.render('index');
});

app.get('/record', (req, res) => {
  // remove file
  if (fs.existsSync(tmpFile)) {
    fs.unlink(tmpFile, (err) => {
      if (err) {
        throw err;
      }
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

app.get('/report', (req, res) => {
  res.send('/report');
});

app.get('/download', (req, res) => {
  res.send('/download');
});

// run
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});