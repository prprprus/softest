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
    if (this._queue.length <= 0) {
      return -1;
    }

    this._capacity++;
    return this._queue.shift();
  }

  async enqueueBlocking(page, element, timeout) {
    while (this._queue.length != 0) {
      await page.waitFor(timeout);
      // Error: enqueueBlocking timeout
      if (this._queue.length != 0) {
        return -1;
      } else {
        break;
      }
    }

    this._queue.push(element);
    this._capacity--;
    return 1;
  }

  async dequeueBlocking(page, timeout) {
    while (this._queue.length == 0) {
      await page.waitFor(timeout);
      // Error: enqueueBlocking timeout
      if (this._queue.length == 0) {
        return -1;
      } else {
        break;
      }
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

const clickTargetBlankEventQueue = new UniqueQueue(name = 'clickTargetBlankEventQueue');
const validClickEventQueue = new UniqueQueue(name = 'validClickEventQueue');
const clickTargetSelfEventQueue = new UniqueQueue(name = 'clickTargetSelfEventQueue');
const coordinatesQueue = new UniqueQueue(name = 'coordinatesQueue');

module.exports = {
  clickTargetBlankEventQueue,
  validClickEventQueue,
  clickTargetSelfEventQueue,
  coordinatesQueue,
}