/**
 * Copyright(c) 2019, prprprus All rights reserved.
 * Use of this source code is governed by a BSD - style.
 * license that can be found in the LICENSE file.
 */

const fs = require('fs');
const path = require('path');
const error = require('../utils/error');

/**
 * Determine if a file or directory exists.
 * 
 * @param {string} path - The absolute path of the directory or the file.
 * @return {boolean} Return true if it exists, false otherwise.
 */
function isExists(path) {
  return fs.existsSync(path);
}

/**
 * Create a directory if it not exists.
 * 
 * @param {string} pathDir - The absolute path of the directory.
 */
function createDir(pathDir) {
  if (!isExists(pathDir)) {
    fs.mkdir(pathDir, function (err) {
      if (err) {
        throw err;
      }
    });
  }
}

/**
 * Delete all files in the directory.
 * 
 * @param {string} pathDir - The absolute path of the directory.
 */
function deleteAllFile(pathDir) {
  fs.readdir(pathDir, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join(pathDir, file), err => {
        if (err) throw err;
      });
    }
  });
}

/**
 * Delete one file.
 * 
 * @param {string} pathFile - The absolute path of the file.
 */
function deleteFile(pathFile) {
  if (isExists(pathFile)) {
    fs.unlink(pathFile, err => {
      if (err) throw err;
    });
  }
}

/**
 * Write content to the file.
 * 
 * @param {string} pathFile - The absolute path of the file.
 * @param {string} conent - What needs to be written.
 */
function writeFile(pathFile, conent) {
  fs.open(pathFile, 'w+', function (err, fd) {
    if (err) {
      throw err;
    }
    fs.write(fd, conent, function (err, written, string) {
      if (err) {
        throw err;
      }
      if (written !== conent.length) {
        throw error.writtenNumber;
      }
      if (string !== conent) {
        throw error.writtenContent;
      }
      fs.close(fd, function (err) {
        if (err) {
          throw err;
        }
      });
    })
  });
}

module.exports = {
  isExists,
  createDir,
  deleteAllFile,
  deleteFile,
  writeFile,
}