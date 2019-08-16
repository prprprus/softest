/**
 * Copyright(c) 2019, prprprus All rights reserved.
 * Use of this source code is governed by a BSD - style.
 * license that can be found in the LICENSE file.
 */

/**
 * Shut down the recorder by signal.
 * 
 * @param {string} recorderPID - The process ID of the recorder.
 */
function shutDownRecorder(recorderPID) {
  process.kill(recorderPID, 'SIGINT');
}

/**
 * Signal processing function.
 * 
 * @param {number} signal - Signal number.
 */
function handleSIGINT(signal) {
  console.log(`Received ${signal}`);
}

/**
 * Capture log information of process output.
 * 
 * @param {object} proc - The process object.
 */
function captureLog(proc) {
  proc.stdout.on('data', (data) => {
    console.log(`${data}`);
  });
  proc.stderr.on('data', (data) => {
    console.log(`${data}`);
  });
  proc.on('close', (code) => {
    console.log(`exit code ${code}`);
  });
}

module.exports = {
  shutDownRecorder,
  handleSIGINT,
  captureLog,
}