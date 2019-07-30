class UniqueQueue {
  constructor(remain = 100) {
    this._name = name
    this._remain = remain;
    this._queue = [];
  }

  get remain() {
    return this._remain;
  }

  set remain(remain) {
    this._remain = remain;
  }

  get name() {
    return this._name
  }

  set name(name) {
    this._name = name
  }

  enqueue(element) {
    // queue full
    if (this._queue.length >= this._remain) {
      return -1;
    }
    // makesure unique
    if (this._find(element) !== undefined) {
      return 0;
    }

    this._queue.push(element);
    this._remain--;
    return 1;
  }

  dequeue() {
    // queue empty
    if (this._queue.length <= 0) {
      return -1;
    }

    this._remain++;
    return this._queue.shift();
  }

  // return value or undefined
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

// producer: bindpageBlankEventListener, consumer: bindNewTabEventListener
const pageBlankEventQueue = new UniqueQueue(name = 'pageBlankEventQueue');
// producer: bindURLChangeEventListener and bindClickEventListener(repeated error), consumer: filterInvalidCoordinates
const validClickQueue = new UniqueQueue(name = 'validClickQueue');

module.exports = {
  UniqueQueue,
  pageBlankEventQueue,
  validClickQueue,
}