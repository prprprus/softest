const express = require('express');
const child_process = require('child_process');

const app = express();
const port = 3000;

var listenerPID = undefined;

// configure
app.set('views', '../public/views');
app.set('view engine', 'pug');
app.use(express.static('../public'));

// route
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/record', (req, res) => {
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

app.get('/end', (req, res) => {
  process.kill(listenerPID, 'SIGINT');
  res.send('/end');
});

app.get('/play', (req, res) => {
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