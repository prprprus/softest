class UniqueQueue {
  constructor(capacity = 1000) {
    this._name = name
    this._capacity = capacity;
    this._queue = [];
  }

  get capacity() {
    return this._capacity;
  }

  set capacity(capacity) {
    this._capacity = capacity;
  }

  get name() {
    return this._name
  }

  set name(name) {
    this._name = name
  }

  enqueue(element) {
    // queue full
    if (this._queue.length >= this._capacity) {
      return -1;
    }
    // makesure unique
    if (this._find(element) !== undefined) {
      return 0;
    }

    this._queue.push(element);
    this._capacity--;
    return 1;
  }

  dequeue() {
    // queue empty
    if (this._queue.length == 0) {
      return -1;
    }

    this._capacity++;
    return this._queue.shift();
  }

  async enqueueBlocking(page, element, timeout) {
    const start = Date.now();
    while (this._queue.this.length >= this._capacity) {
      if (Date.now() - start > timeout) {
        if (this._queue.this.length >= this._capacity) {
          return -1;
        } else {
          break;
        }
      }
      await page.waitFor(100);
    }

    // makesure unique
    if (this._find(element) !== undefined) {
      return 0;
    }

    this._queue.push(element);
    this._capacity--;
    return 1;
  }

  async dequeueBlocking(page, timeout) {
    const start = Date.now();
    while (this._queue.length == 0) {
      if (Date.now() - start > timeout) {
        if (this._queue.length == 0) {
          return -1;
        } else {
          break;
        }
      }
      await page.waitFor(100);
    }

    this._capacity++;
    return this._queue.shift();
  }

  // return undefined if not found
  _find(element) {
    this._queue.find((e) => {
      return e === element;
    });
  }

  getFirstElement() {
    return this._queue[0];
  }

  length() {
    return this._queue.length;
  }
}

const eventClickTargetBlank = new UniqueQueue(name = 'eventClickTargetBlank');
const eventValidClick = new UniqueQueue(name = 'eventValidClick');
const eventClickTargetSelf = new UniqueQueue(name = 'eventClickTargetSelf');
const eventClickTargetSelfCoordinates = new UniqueQueue(name = 'eventClickTargetSelfCoordinates');

module.exports = {
  eventClickTargetBlank,
  eventValidClick,
  eventClickTargetSelf,
  eventClickTargetSelfCoordinates,
}