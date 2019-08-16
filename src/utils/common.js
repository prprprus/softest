/**
 * Copyright(c) 2019, prprprus All rights reserved.
 * Use of this source code is governed by a BSD - style.
 * license that can be found in the LICENSE file.
 */

const queue = require('../utils/queue');

/**
 * For some websites(such as https://www.qq.com), it will automatically trigger a click
 * event after opening, which will cause the queue initialization error,
 * so we need to reinitialize the queue after the open operation.
 */
function initAllQueue() {
  queue.clickTargetBlank.dequeue();
  queue.validClick.dequeue();
}

/**
 * Add format function for string type.
 * 
 * @return {string}
 */
function addFormatFunction() {
  String.prototype.format = function () {
    let i = 0;
    const args = arguments;
    return this.replace(/{}/g, function () {
      return typeof args[i] != 'undefined' ? args[i++] : '';
    });
  };
}

/**
 * Format the data to be sent.
 * 
 * @param {string} statement - User operation corresponding statement.
 * @param {string} time - Time of operation.
 * @param {string} operation - Operation of operation.
 * @param {string} target - Target of operation.
 * @return Data in JSON format.
 */
function formatData(statement, time, operation, target) {
  data = {
    statement: statement,
    log: {
      time: time,
      operation: operation,
      target: target
    }
  }
  return JSON.stringify(data);
}

/**
 * Get current date time.
 * E.g: 2019-08-13 18:29:03
 * 
 * @return {string}
 */
function getCurrentDateTime() {
  const today = new Date();
  const date = today.getFullYear() + '-' + fill0((today.getMonth() + 1)) + '-' + fill0(today.getDate());
  const time = fill0(today.getHours()) + ":" + fill0(today.getMinutes()) + ":" + fill0(today.getSeconds());
  return date + ' ' + time;
}

/**
 * Fill 0.
 * 
 * @param {number} num - Date or time.
 * @return {string}
 */
function fill0(num) {
  if (num < 10) {
    return '0' + num.toString();
  }
  return num;
}

module.exports = {
  initAllQueue,
  addFormatFunction,
  formatData,
  getCurrentDateTime,
}