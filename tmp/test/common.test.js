const common = require('../utils/common');
const queue = require('../utils/queue');

describe('initAllQueue', function () {
  it('should length is 0', () => {
    common.initAllQueue();
    expect(queue.clickTargetBlank.length()).toBe(0);
    expect(queue.validClick.length()).toBe(0);
  });
});

describe('addFormatFunction', function () {
  it('should add format function', () => {
    common.addFormatFunction();
    expect('hello {}'.format('softest')).toBe('hello softest');
  });
})

describe('formatData', function () {
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
    expect(common.getCurrentDateTime()).toBe(common.getCurrentDateTime());
  });
});