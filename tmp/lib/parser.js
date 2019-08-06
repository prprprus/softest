const queue = require('../utils/queue');
const error = require('../utils/error');
const common = require('../utils/common');
const sender = require('./sender');
const statement = require('./statement');
const event = require('./event');

/**
 * Check the coordinates of the callback information.
 * 
 * @param {object} info - Callback information for `click` event.
 */
function checkCoordinates(info) {
  if (info.x < 0 || info.y < 0) {
    throw error.coordinatesParam;
  }
}

/**
 * Determine if the click is valid click.
 * 
 * If click on some non-jumpable elements (like `<p>xxx</p>`), it is an invalid click.
 * If the click belongs to the click (target_blank) or click (target_self) operation,
 * it is a valid click.
 * 
 * @param {puppeteer.Page} page - The current page.
 * @param {object} info - Callback information for `click` event.
 */
async function isInvalidClick(page, info) {
  // `input` event
  if (isInput(info)) {
    const xpath = await common.getXPathByElement(page, info);
    queue.input.enqueue(xpath);
    return true;
  }

  const flag = await queue.validClick.dequeueBlocking(page, 1000);
  console.log('👏', flag);
  console.log('👏', info.targetName);

  // Condition 1: See also annotate of `initAllQueue`.
  // Condition 2: Invalid click when the flag is -1.
  if ((flag != -1 && info.targetName == 'LI') || (flag == -1)) {
    return true;
  }
  return false;
}

/**
 * 
 * @param {*} info 
 */
function isInput(info) {
  if (info.targetName == 'INPUT') {
    return true;
  }
  return false;
}

/**
 * 
 * 
 * @param {puppeteer.Page} page - The current page.
 * @param {object} info - Callback information for `click` event.
 * @return {string} The statement of puppeteer.
 */
async function parseClick(page, info) {
  checkCoordinates(info);

  if ((await isInvalidClick(page, info))) {
    return;
  }

  const stmt = await parseClickTargetBlank(page, info);
  return stmt;
}

/** 
 * Parse the statement corresponding to the `clickTargetBlank` event.
 * 
 * @param {puppeteer.Page} page - The current page.
 * @param {object} info - Callback information for `click` event.
 * @return {string} The statement of `clickTargetBlank` event.
 */
async function parseClickTargetBlank(page, info) {
  const xpath = await common.getXPathByElement(page, info);
  console.log('XPath: ', xpath);
  const ctb = new statement.ClickTargetBlank(event.clickTargetBlank);
  const stmt = ctb.getStatement(xpath, info);
  return stmt;
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
 * Parse the statement corresponding to the `URLChange` event (operation 2 or operation 3).
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
 * 
 * @param {*} xpath 
 * @param {*} value 
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