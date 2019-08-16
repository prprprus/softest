/**
 * Copyright(c) 2019, prprprus All rights reserved.
 * Use of this source code is governed by a BSD - style.
 * license that can be found in the LICENSE file.
 */

const io = require('../src/utils/io');
const fs = require('fs');
const child_process = require('child_process');

beforeAll(() => {
  child_process.spawnSync(`mkdir -p  ./testDir`, {
    shell: true,
  });
});

afterAll(() => {
  child_process.spawnSync(`rm -rf ./testDir`, {
    shell: true,
  });
});

describe('isExists', () => {
  it('should return true', () => {
    expect(io.isExists('./testDir')).toBeTruthy();
  });
  it('should return false', () => {
    expect(io.isExists('./testDir' + '/file.js')).toBeFalsy();
  })
});

describe('createDir', () => {
  it('should return true', () => {
    io.createDir('./dir');
    expect(io.isExists('./dir')).toBeTruthy();
    child_process.spawnSync(`rm -rf ./dir`, {
      shell: true,
    });
  });
});

describe('deleteAllFile', () => {
  it('should return []', () => {
    child_process.spawnSync(`mkdir -p ./testDir && cd ./testDir && touch file1.js file2.js file3.js`, {
      shell: true,
    });
    io.deleteAllFile('./testDir');
    expect(fs.readdirSync('./testDir')).toEqual([]);
  });
});

describe('deleteFile', () => {
  it('should return [file2.js, file3.js]', () => {
    child_process.spawnSync(`mkdir -p ./testDir && cd ./testDir && touch file1.js file2.js file3.js`, {
      shell: true,
    });
    io.deleteFile('./testDir/file1.js');
    expect(fs.readdirSync('./testDir')).toEqual(['file2.js', 'file3.js']);
  });
});

describe('writeFile', () => {
  it('should no error', () => {
    child_process.spawnSync(`mkdir -p ./testDir && cd ./testDir && touch file1.js`, {
      shell: true,
    });
    io.writeFile('./testDir/file1.js', '123456789');
  });
});