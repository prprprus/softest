/**
 * Copyright(c) 2019, prprprus All rights reserved.
 * Use of this source code is governed by a BSD - style.
 * license that can be found in the LICENSE file.
 */

const common = require('../src/utils/common');
const queue = require('../src/utils/queue');

describe('initAllQueue', () => {
  it('should length is 0', () => {
    common.initAllQueue();
    expect(queue.clickTargetBlank.length()).toBe(0);
    expect(queue.validClick.length()).toBe(0);
  });
});

describe('addFormatFunction', () => {
  it('should add format function', () => {
    common.addFormatFunction();
    expect('hello {}'.format('softest')).toBe('hello softest');
  });
})

describe('formatData', () => {
  it('should return json format', () => {
    expect(common.formatData('x', 'y', 'z', 'q')).toEqual(JSON.stringify({
      statement: 'x',
      log: {
        time: 'y',
        operation: 'z',
        target: 'q'
      }
    }));
  });
});

describe('getCurrentDateTime', function () {
  it('should not equal', () => {
    const start = common.getCurrentDateTime();
    expect(start).toBe(common.getCurrentDateTime());
  });
});