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
  // Due to the network environment, there is a need to block waiting here.
  // See also annotate of `bindURLChangeListener`.
  // 动态配置参数：慢：60000；良好：~=4000；本地：<1000
  let flag = await queue.eventValidClick.dequeueBlocking(page, 4000);
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
 * Determine if the `ClickTargetSelf` event.
 * 
 * @param {puppeteer.Page} page - The current page.
 */
async function isClickTargetSelf(page) {
  console.log('原来长度:', queue.eventClickTargetSelf.length());
  let flag = await queue.eventClickTargetSelf.dequeueBlocking(page, 1000);
  console.log('剩下长度:', queue.eventClickTargetSelf.length());
  console.log('👺', flag);
  if (flag == -1) {
    return false;
  }
  return true
}

/**
 * Parse the statement of puppeteer.
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

  if ((await isClickTargetSelf(page))) {
    console.log('===> info send ', info);
    // Determined to be a click (target_self) operation and send callback information into queue.
    queue.eventClickTargetSelfCoordinates.enqueue(info);
    // If it is a ClickTargetSelf event, the original document will be destroyed,
    // and the following operation of parsing the XPath can no longer be run.Instead,
    // it should jump back to bindURLChangeListener to resolve the XPath.
    // See also annotate of `bindURLChangeListener`.
    return;
  }

  const statement = await parseClickTargetBlank(page, info);
  await sender.sendData(statement);
}

/** 
 * Parse the statement corresponding to the `clickTargetBlank` event.
 * 
 * @param {puppeteer.Page} page - The current page.
 * @param {object} info - Callback information for `click` event.
 */
async function parseClickTargetBlank(page, info) {
  const xpath = await common.getXPathByElement(page, info);
  console.log('XPath: ', xpath);
  // parse statement
  const ctb = new statement.ClickTargetBlank(event.clickTargetBlank);
  const stmt = ctb.getStatement(xpath, info);
  return stmt;
}

function parseClickTargetSelf() {}

function parseNewTab() {}

function parseCloseTab() {}

module.exports = {
  parseClick,
  parseClickTargetSelf,
  parseNewTab,
  parseCloseTab,
}