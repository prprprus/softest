const queue = require('../utils/queue');
const pptr = require('puppeteer');
const error = require('../utils/error');

jest.setTimeout(30000);

var browser = null;
var page = null;

beforeAll(async () => {
  const options = {
    headless: false,
    devtools: false,
    executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium',
    args: [
      `--window-size=1265,1400`,
    ],
  }
  browser = await pptr.launch(options);
  page = await browser.newPage();
});

afterAll(async () => {
  await browser.close();
});

describe('UniqueQueue', () => {
  const q = new queue.UniqueQueue(name = 'unitest');

  // capacity
  it('should return 100', () => {
    expect(q.capacity).toBe(100);
  });
  it('should return 300', () => {
    q.capacity = 300;
    expect(q.capacity).toBe(300);
  });
  // enqueue
  it('should return -1', () => {
    q.capacity = 0;
    expect(q.enqueue(1)).toBe(-1);
    q.capacity = 100;
  });
  it('should return 1', () => {
    expect(q.enqueue(1)).toBe(1);
  });
  it('should return 0', () => {
    expect(q.enqueue(1)).toBe(0);
  });
  // dequeue
  it('should return 1', () => {
    expect(q.dequeue()).toBe(1);
  });
  it('should return -1', () => {
    expect(q.dequeue()).toBe(-1);
  });
  // getFirstElement
  it('should return undefined', () => {
    expect(q.getFirstElement()).toBe(undefined);
  });
  it('should return 233', () => {
    q.enqueue(233);
    expect(q.getFirstElement()).toBe(233);
  });
  // length (now q is [233, ])
  it('should return 233', () => {
    expect(q.length()).toBe(1);
  });
  // dequeueBlocking
  it('should return error.timeoutParam', async () => {
    try {
      await q.dequeueBlocking(page, -1);
    } catch (e) {
      expect(e).toEqual(error.timeoutParam);
    }
  });
  it('should return 233', async () => {
    const elm = await q.dequeueBlocking(page, 1000);
    expect(elm).toBe(233);
  });
  it('should return -1', async () => {
    const elm = await q.dequeueBlocking(page, 1000);
    expect(elm).toBe(-1);
  });
  // enqueueBlocking (now q is [])
  it('should return 1', async () => {
    const flag = await q.enqueueBlocking(page, 233, 1000);
    expect(flag).toBe(1);
  });
  it('should return 0', async () => {
    const flag = await q.enqueueBlocking(page, 233, 1000);
    expect(flag).toBe(0);
  });
  it('should return error.timeoutParam', async () => {
    try {
      await q.enqueueBlocking(page, 233, -1);
    } catch (e) {
      expect(e).toEqual(error.timeoutParam);
    }
  });
  it('should return -1', async () => {
    q.capacity = 1;
    const flag = await q.enqueueBlocking(page, 123, 1000);
    expect(flag).toBe(-1);
    q.capacity = 100;
  });
});