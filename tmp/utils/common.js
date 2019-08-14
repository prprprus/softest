/**
 * Copyright(c) 2019, prprprus All rights reserved.
 * Use of this source code is governed by a BSD - style.
 * license that can be found in the LICENSE file.
 */

const queue = require('../utils/queue');
const pptr = require('puppeteer');
const error = require('./error');

/**
 * Switch the current page to the latest.
 * 
 * @param {puppeteer.Browser} browser - Browser instance launched via puppeteer.
 * @return {puppeteer.Page} The latest page.
 */
async function switch_to_latest_tab(browser) {
  const pages = await browser.pages();
  page = pages[pages.length - 1];
  await page.bringToFront();
  return page;
}

/**
 * Set the width and height of viewport.
 * 
 * Note: width and height must be greater than the default,
 * otherwise an exception is thrown.
 * 
 * @param {puppeteer.Page} page - The current page.
 * @param {number} width - Width of the viewport.
 * @param {number} height - Height of the viewport.
 */
async function setViewport(page, width, height) {
  if (width < 800 || height < 600) {
    throw error.viewport;
  }
  await page.setViewport({
    width: width,
    height: height
  });
}

/**
 * Refresh the page.
 * 
 * @param {puppeteer.Page} page - The current page.
 */
async function refresh(page) {
  await page.evaluate(() => {
    location.reload(true);
  });
}

/**
 * Close default blank page.
 * 
 * @param {puppeteer.Browser} browser - Browser instance launched via puppeteer.
 */
async function closeBlankPage(browser) {
  const pages = await browser.pages();
  await pages[0].close();
}

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
 * Parse the Xpath of element.
 * 
 * @param {puppeteer.Page} page - The current page.
 * @param {object} info - Callback information for the `click` event.
 * @return {string} The XPath of element.
 */
async function getXPathByElement(page, info) {
  const xpath = await page.evaluate((info) => {
    // get element by coordinate
    let element = document.elementFromPoint(info.x, info.y);
    // maybe need to scroll the window
    if (element === null) {
      window.scrollTo(info.x, info.y);
      element = document.elementFromPoint(info.x, info.y);
    }
    if (element && element.id)
      return '//*[@id="' + element.id + '"]';
    else {
      var paths = [];
      // Use nodeName (instead of localName) so namespace prefix is included (if any).
      for (; element && element.nodeType == Node.ELEMENT_NODE; element = element.parentNode) {
        var index = 0;
        var hasFollowingSiblings = false;
        for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
          // Ignore document type declaration.
          if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
            continue;
          if (sibling.nodeName == element.nodeName)
            ++index;
        }
        for (var sibling = element.nextSibling; sibling && !hasFollowingSiblings; sibling = sibling.nextSibling) {
          if (sibling.nodeName == element.nodeName)
            hasFollowingSiblings = true;
        }
        var tagName = (element.prefix ? element.prefix + ":" : "") + element.localName;
        var pathIndex = (index || hasFollowingSiblings ? "[" + (index + 1) + "]" : "");
        paths.splice(0, 0, tagName + pathIndex);
      }
      return paths.length ? "/" + paths.join("/") : null;
    }
  }, info);

  return xpath;
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

/**
 * Shut down the recorder by signal.
 * 
 * @param {string} recorderPID - The process ID of the recorder.
 */
function shutDownRecorder(recorderPID) {
  process.kill(recorderPID, 'SIGINT');
}

/**
 * Signal processing function.
 * 
 * @param {number} signal - Signal number.
 */
function handleSIGINT(signal) {
  console.log(`Received ${signal}`);
}

/**
 * Capture log information of process output.
 * 
 * @param {object} proc - The process object.
 */
function captureLog(proc) {
  proc.stdout.on('data', (data) => {
    console.log(`${data}`);
  });
  proc.stderr.on('data', (data) => {
    console.log(`${data}`);
  });
  proc.on('close', (code) => {
    console.log(`exit code ${code}`);
  });
}

module.exports = {
  switch_to_latest_tab,
  setViewport,
  refresh,
  closeBlankPage,
  initAllQueue,
  getXPathByElement,
  addFormatFunction,
  formatData,
  getCurrentDateTime,
  shutDownRecorder,
  handleSIGINT,
  captureLog,
}