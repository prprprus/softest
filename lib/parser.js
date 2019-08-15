/**
 * Copyright(c) 2019, prprprus All rights reserved.
 * Use of this source code is governed by a BSD - style.
 * license that can be found in the LICENSE file.
 */

const queue = require('../utils/queue');
const error = require('../utils/error');
const common = require('../utils/common');
const statement = require('./statement');
const event = require('./event');

/**
 * Check the coordinates of the callback information.
 * 
 * @param {object} info - Callback information for the `click` event.
 */
function checkCoordinates(info) {
  if (info.x < 0 || info.y < 0) {
    throw error.coordinatesParam;
  }
}

/**
 * Determine if the click is valid.
 * 
 * If click on some non-jumpable elements (like `<p>xxx</p>`), it is an invalid click.
 * 
 * @param {puppeteer.Page} page - The current page.
 * @param {object} info - Callback information for the `click` event.
 * @return {boolean} Return true if the click is valid, otherwise, return false.
 */
async function isInvalidClick(page, info) {
  if (isInput(info)) {
    const xpath = await common.getXPathByElement(page, info);
    queue.input.enqueue(xpath);
    return true;
  }

  const flag = await queue.validClick.dequeueBlocking(page, 2000);

  if ((flag != -1 && info.targetName == 'LI') || (flag == -1)) {
    return true;
  }
  return false;
}

/**
 * Determine whether the `input` event.
 * 
 * @param {object} info - Callback information for the `click` event.
 * @return {boolean} Return true if is `input` event, otherwise, return false.
 */
function isInput(info) {
  if (info.targetName == 'INPUT' && info.type !== 'submit' && info.value !== '') {
    return true;
  }
  return false;
}

/**
 * Parse the `click` event.
 * 
 * @param {puppeteer.Page} page - The current page.
 * @param {object} info - Callback information for the `click` event.
 * @return {string} The statement of `click` event.
 * @return {string} The XPath of the element.
 */
async function parseClick(page, info) {
  checkCoordinates(info);

  if ((await isInvalidClick(page, info))) {
    return undefined;
  }

  const res = await parseClickTargetBlank(page, info);
  return res;
}

/** 
 * Parse the statement corresponding to the `clickTargetBlank` event.
 * 
 * @param {puppeteer.Page} page - The current page.
 * @param {object} info - Callback information for the `click` event.
 * @return {string} The statement of `clickTargetBlank` event.
 * @return {string} The XPath of the element.
 */
async function parseClickTargetBlank(page, info) {
  const xpath = await common.getXPathByElement(page, info);
  const ctb = new statement.ClickTargetBlank(event.clickTargetBlank);
  const stmt = ctb.getStatement(xpath, info);
  return [stmt, xpath];
}

/**
 * Parse the statement corresponding to the `newTab` event.
 * 
 * @return {string} The statement of `newTab` event.
 */
function parseNewTab() {
  const nt = new statement.NewTab(event.newTab);
  const stmt = nt.getStatement();
  return stmt;
}

/**
 * Parse the statement corresponding to the `URLChange` event.
 * 
 * @param {string} url - The target url.
 * @return {string} The statement of `URLChange` event.
 */
function parseURLChange(url) {
  const uc = new statement.URLChange(event.URLChange);
  const stmt = uc.getStatement(url);
  return stmt;
}

/**
 * Parse the statement corresponding to the `closeTab` event.
 * 
 * @return {string} The statement of `closeTab` event.
 */
function parseCloseTab() {
  const ct = new statement.CloseTab(event.closeTab);
  const stmt = ct.getStatement();
  return stmt;
}

/**
 * Parse the statement corresponding to the `input` event.
 * 
 * @param {string} xpath - The XPath of the element.
 * @param {object} info - Callback information for the `input` event.
 * @return {string} The statement of `input` event.
 */
async function parseInput(xpath, info) {
  const i = new statement.Input(event.input);
  const stmt = i.getStatement(xpath, info);
  return stmt;
}

module.exports = {
  parseClick,
  parseNewTab,
  parseCloseTab,
  parseURLChange,
  parseInput,
}