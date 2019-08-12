const {
  spawn
} = require('child_process');

const ls = spawn('node', ['/Users/tiger/develop/tmp/lib/listener.js', ]);
ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});