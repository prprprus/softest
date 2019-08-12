// common operation

const queue = require('../utils/queue');
const pptr = require('puppeteer');

/**
 * Switch the current page to the latest.
 * 
 * @param {puppeteer.Browser} browser - Browser instance launched via puppeteer.
 * @return {puppeteer.Page} Latest open page.
 */
async function switch_to_latest_tab(browser) {
  let pages = await browser.pages();
  console.log('number of page:', pages.length);
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
    throw 'viewport size error';
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
  let pages = await browser.pages();
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
 * Parse the Xpath.
 * 
 * @param {puppeteer.Page} page - The current page.
 * @param {object} info - Callback information for `click` event.
 * @return {string} The XPath.
 */
async function getXPathByElement(page, info) {
  const xpath = await page.evaluate((info) => {
    console.log('info: ', info);
    // get element by coordinate
    let element = document.elementFromPoint(info.x, info.y);
    // may need to scroll the window
    if (element === null) {
      window.scrollTo(info.x, info.y);
      element = document.elementFromPoint(info.x, info.y);
    }

    if (element && element.id)
      return '//*[@id="' + element.id + '"]';
    else {
      var paths = [];
      console.log('=>fuxk', element.nodeType);
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
 * Extends string prototype.
 * 
 * @return {string} Filled string.
 */
function extendsStringPrototype() {
  String.prototype.format = function () {
    let i = 0;
    const args = arguments;
    return this.replace(/{}/g, function () {
      return typeof args[i] != 'undefined' ? args[i++] : '';
    });
  };
}

/**
 * Generate temporary Browser instance.
 * 
 * @param {string} url - The URL to open.
 * @return {puppeteer.Browser} The temporary browser.
 * @return {puppeteer.Page} The temporary page.
 */
async function genTemporaryBrowser(url) {
  let tmpBrowser = await pptr.launch({
    'headless': false,
    args: [
      `--window-size=2540,1318`,
    ],
  });
  let tmpPage = await tmpBrowser.newPage();
  await setViewport(tmpPage, 2540, 1318);
  await tmpPage.goto(url, {
    waitUntil: 'networkidle0',
  });
  return [tmpBrowser, tmpPage];
}

/**
 * Close temporary Browser instance.
 * 
 * @param {puppeteer.Browser} browser - The temporary browser.
 */
async function closeTemporaryBrowser(browser) {
  await browser.close();
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
 * Get Current Time.
 */
function getCurrentDateTime() {
  const today = new Date();
  const date = today.getFullYear() + '-' + fillZero((today.getMonth() + 1)) + '-' + fillZero(today.getDate());
  const time = fillZero(today.getHours()) + ":" + fillZero(today.getMinutes()) + ":" + fillZero(today.getSeconds());
  return date + ' ' + time;
}

/**
 * 
 * @param {number} num - Date or time.
 * @return {string} - A number of length 2.
 */
function fillZero(num) {
  if (num < 10) {
    return '0' + num.toString();
  }
  return num;
}

function stopRecorder(recorderPID) {
  process.kill(recorderPID, 'SIGINT');
}

module.exports = {
  switch_to_latest_tab,
  setViewport,
  refresh,
  closeBlankPage,
  initAllQueue,
  getXPathByElement,
  extendsStringPrototype,
  genTemporaryBrowser,
  closeTemporaryBrowser,
  formatData,
  getCurrentDateTime,
  stopRecorder,
}