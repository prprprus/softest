class UniqueQueue {
  constructor(size = 100) {
    this._size = size;
    this._queue = [];
  }

  get size() {
    return this._size;
  }

  set size(size) {
    this._size = size;
  }

  enqueue(element) {
    // queue full
    if (this._queue.length >= this._size) {
      return -1;
    }
    // makesure unique
    if (this._find(element) !== undefined) {
      return 0;
    }

    this._queue.push(element);
    this._size--;
    return 1;
  }

  dequeue() {
    // queue empty
    if (this._queue.length <= 0) {
      return -1;
    }

    this._size++;
    return this._queue.shift();
  }

  // return value or undefined
  _find(element) {
    this._queue.find((e) => {
      return e === element;
    });
  }
}

module.exports = {
  UniqueQueue
}