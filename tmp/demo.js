const child_process = require('child_process');

const proc = child_process.spawnSync(`npm list -g | head -n 1`, {
  shell: true,
  encoding: 'utf8'
});

console.log('==================>', proc.stdout);