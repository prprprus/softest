const error = require('./error');

/**
 * Class UniqueQueue is a FIFO message queue with unique elements.
 */
class UniqueQueue {
  /**
   * Create UniqueQueue object.
   * 
   * @param {string} name - Name of queue.
   * @param {number} capacity - Capacity of queue.
   */
  constructor(name, capacity = 100) {
    this.name = name
    this._capacity = capacity;
    this._queue = [];
  }

  get capacity() {
    return this._capacity;
  }

  set capacity(capacity) {
    if (capacity <= 0) {
      capacity = 100;
    }
    this._capacity = capacity;
  }

  /**
   * Put the element into the tail of the queue, non-blocking.
   * Returns -1 if the queue is full, 0 if the element already exists,
   * otherwise returns 1 successfully.
   * 
   * @param {*} element - Element of queue.
   * @return {number} Code of result.
   */
  enqueue(element) {
    if (this._queue.length >= this._capacity) {
      return -1;
    }
    if (this._find(element) !== undefined) {
      return 0;
    }

    this._queue.push(element);
    this._capacity--;
    return 1;
  }

  /**
   * Get the element from the queue, non-blocking.
   * Returns -1 if the queue is empty,
   * otherwise returns the first element successfully.
   * 
   * @return {*} Element of queue.
   */
  dequeue() {
    if (this._queue.length == 0) {
      return -1;
    }

    this._capacity++;
    return this._queue.shift();
  }

  /**
   * Put the element into the tail of the queue, blocking until timeout occurs.
   * Returns -1 if the queue is full, 0 if the element already exists,
   * otherwise returns 1 successfully.
   * 
   * @param {puppeteer.Page} page - The current page.
   * @param {*} element - Element of queue.
   * @param {number} timeout - Time of blocking.
   * @return {number} Code of result.
   */
  async enqueueBlocking(page, element, timeout) {
    if (this._find(element) !== undefined) {
      return 0;
    }
    if (timeout < 0) {
      throw error.errorTimeoutParam;
    }
    if (timeout == 0) {
      return this.enqueue(element);
    }

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

    this._queue.push(element);
    this._capacity--;
    return 1;
  }

  /**
   * Get the element from the queue, blocking until timeout occurs.
   * Returns -1 if the queue is empty,
   * otherwise returns the first element successfully.
   * 
   * @param {puppeteer.Page} page - The current page.
   * @param {number} timeout - Time of blocking.
   * @return {*} Element of queue.
   */
  async dequeueBlocking(page, timeout) {
    if (timeout < 0) {
      throw error.errorTimeoutParam;
    }

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

  /**
   * Returns undefined if not found, otherwise returns the element.
   * 
   * @param {*} element - Element of queue.
   * @return element or undefined.
   */
  _find(element) {
    this._queue.find((e) => {
      return e === element;
    });
  }

  /**
   * Returns undefined if queue is empty, otherwise returns the first element.
   * This method does not delete elements.
   * 
   * @return element or undefined.
   */
  getFirstElement() {
    return this._queue[0];
  }

  /**
   * Returns the number of elements in the queue.
   * 
   * @return {number} Number of elements in the queue.
   */
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