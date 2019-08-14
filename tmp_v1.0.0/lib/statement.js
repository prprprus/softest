/**
 * Copyright(c) 2019, prprprus All rights reserved.
 * Use of this source code is governed by a BSD - style.
 * license that can be found in the LICENSE file.
 */

const common = require('../utils/common');

// Template of statement.

var templateScroll = `
await page.evaluate(async () => {
  await new Promise((resolve, reject) => {
    let totalHeight = 0;
    let distance = {};
    let scrollHeight = {};
    let timer = setInterval(() => {
      window.scrollBy({}, distance);
      totalHeight += distance;
      if (totalHeight >= scrollHeight) {
        clearInterval(timer);
        resolve();
      }
    }, distance);
  });
});
await page.waitFor(1000);

`;

var templateClickTargetBlank = `
element = await page.$x('{}');
await element[0].click();
await page.waitFor(3000);
pages = await browser.pages();
page = pages[pages.length - 1];
await page.bringToFront();
await page.setViewport({
  width: 1265,
  height: 1400
});
await page.waitFor(500);

`;

var templateNewTab = `
page = await browser.newPage();
await page.setViewport({
  width: 1265,
  height: 1400
});
await page.waitFor(500);

`;

var templateURLChange = `
await page.goto('{}', {
  waitUntil: 'networkidle0',
});
await page.waitFor(1000);

`;

var templateCloseTab = `
await page.close();
pages = await browser.pages();
page = pages[pages.length - 1];
await page.bringToFront();
await page.waitFor(500);

`;

var templateInput = `
element = await page.$x('{}');
await element[0].type('{}', {delay: 100});
await page.waitFor(3000);

`;

/**
 * Class Statement represents the code statement corresponding to the user operation.
 */
class Statement {
  /**
   * Create a Statement object and add a format method to string.
   * 
   * @param {string} eventType - Type of event.
   */
  constructor(eventType) {
    this.eventType = eventType;
    common.addFormatFunction();
  }
}

/**
 * Class ClickTargetBlank represents the code statement corresponding to the `clickTargetBlank` event.
 */
class ClickTargetBlank extends Statement {
  constructor(eventType) {
    super(eventType);
  }

  /**
   * Scroll if the position of the element is no longer visible, otherwise, get the statement directly.
   * 
   * @param {string} xpath - XPath of element.
   * @param {object} info - Callback information for the `click` event.
   * @return {string} The code statement of `clickTargetBlank` event.
   */
  getStatement(xpath, info) {
    const scrollY = info.scrollY;
    const scrollX = 0;
    const step = 100;
    let statement = undefined;

    if (info.scrollY > 1000) {
      statement = templateScroll.format(step, scrollY, scrollX) + templateClickTargetBlank.format(xpath);
    } else {
      statement = templateClickTargetBlank.format(xpath);
    }
    return statement;
  }
}

/**
 * Class NewTab represents the code statement corresponding to the `newTab` event.
 */
class NewTab extends Statement {
  constructor(eventType) {
    super(eventType);
  }

  /**
   * Get the statement directly.
   * 
   * @return {string} The code statement of `newTab` event.
   */
  getStatement() {
    return templateNewTab;
  }
}

/**
 * Class URLChange represents the code statement corresponding to the `URLChange` event.
 */
class URLChange extends Statement {
  constructor(eventType) {
    super(eventType);
  }

  /**
   * Get the statement by URL.
   * 
   * @param {string} url - The url to change.
   * @return {string} The code statement of `URLChange` event.
   */
  getStatement(url) {
    return templateURLChange.format(url);
  }
}

/**
 * Class CloseTab represents the code statement corresponding to the `closeTab` event.
 */
class CloseTab extends Statement {
  constructor(eventType) {
    super(eventType);
  }

  /**
   * Get the statement directly.
   * 
   * @return {string} The code statement of `closeTab` event.
   */
  getStatement() {
    return templateCloseTab;
  }
}

/**
 * Class Input represents the code statement corresponding to the `input` event.
 */
class Input extends Statement {
  constructor(eventType) {
    super(eventType)
  }

  /**
   * Scroll if the position of the element is no longer visible, otherwise, get the statement directly.
   * 
   * @param {string} xpath - XPath of element.
   * @param {object} info - Callback information for the `click` event.
   * @return {string} The code statement of `input` event.
   */
  getStatement(xpath, info) {
    const scrollY = info.scrollY;
    const scrollX = 0;
    const step = 100;
    let statement = undefined;

    if (info.scrollY > 1000) {
      statement = templateScroll.format(step, scrollY, scrollX) + templateInput.format(xpath, info.value);
    } else {
      statement = templateInput.format(xpath, info.value);
    }
    return statement;
  }
}

module.exports = {
  ClickTargetBlank,
  NewTab,
  URLChange,
  CloseTab,
  Input,
}