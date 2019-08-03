// common operation

const queue = require('../utils/queue');

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
 * For some websites(such as www.qq.com), it will automatically trigger a click
 * event after opening, which will cause the queue initialization error,
 * so we need to reinitialize the queue after the open operation.
 */
function initAllQueue() {
  queue.eventClickTargetBlank.dequeue();
  queue.eventValidClick.dequeue();
  queue.eventClickTargetSelf.dequeue();
  queue.eventClickTargetSelfCoordinates.dequeue();
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

module.exports = {
  switch_to_latest_tab,
  setViewport,
  refresh,
  closeBlankPage,
  initAllQueue,
  getXPathByElement,
}