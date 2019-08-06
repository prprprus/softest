const pptr = require('puppeteer');
const parser = require('./parser');
const sender = require('./sender');
const queue = require('../utils/queue');
const event = require('./event');
const common = require('../utils/common');

const invalidURL = [
  'chrome-extension://kmendfapggjehodndflmmgagdbamhnfd/_generated_background_page.html',
  'about:blank',
]

/**
 * The callback function of the `click` event.
 * 
 * @param {puppeteer.Browser} browser - Browser instance launched via puppeteer.
 * @param {puppeteer.Page} page - The current page.
 * @param {object} info - Callback information for `click` event.
 */
async function clickCallback(page, info) {
  await parser.parseClick(page, info);
}

/**
 * Binding a page-level listener for `click` event, the listener catches
 * the event and executes the callback function when the page is clicked.
 * 
 * Note: Since all clicks are captured, need to filter invalid clicks.
 * 
 * @param {puppeteer.Browser} browser - Browser instance launched via puppeteer.
 * @param {puppeteer.Page} page - The current page.
 */
async function bindClickListener(page) {
  try {
    // Expose the callback function of the `click` event in Node environment,
    // when the `click` event is captured, switches back to the node environment
    // from the browser environment, and executes the callback function.
    await page.exposeFunction('clickCallback', (info) => {
      (async () => {
        await clickCallback(page, info);
      })();
    });
  } catch (e) {
    console.log('⚠️ Repeat binding listener, return.');
    return;
  }

  // register the listener for the `click` event in the document
  await page.evaluateOnNewDocument((click) => {
    console.log('in evaluateOnNewDocument...');
    document.addEventListener(click.type, (e) => clickCallback({
      targetName: e.target.tagName, // the tag name of the element
      eventType: click.type, // type of event ('click')
      x: e.clientX, // horizontal coordinate of the element
      y: e.clientY, // vertical coordinate of the element
      scrollY: e.pageY, // vertical height of the scroll
      d: console.log(e), // debug info
    }), true /* capture */ );
  }, event.click);

  await bindClickTargetBlankListener(page);
}

/**
 * Binding a page-level listener for `clickTargetBlank` event, the listener catches
 * the event and executes the callback function when the click (target_blank) occur.
 * 
 * Note: Since the `clickTargetBlank` event will occur with the `newTab` event,
 * need to use queue synchronization to distinguish. See also `bindNewTabListener` annotate.
 * 
 * @param {puppeteer.Page} page - The current page.
 */
async function bindClickTargetBlankListener(page) {
  page.on(event.clickTargetBlank.type, function (e) {
    console.log("❤️️️️️️❤️❤️");
    // mark `clickTargetBlank` event
    queue.eventClickTargetBlank.enqueue('🔥');
  });
}

/**
 * Binding a browser-level listener for `newTab` event, the listener catches
 * the event and executes the callback function when open the tab (window).
 * 
 * There are two operations that will trigger the `newTab` event:
 *  1. new tab
 *  2. click (target_blank)
 * 
 * The callback of the `newTab` event will be executed after the `click` event,
 * need to use queue synchronization.
 * 
 * @param {puppeteer.Browser} browser - Browser instance launched via puppeteer.
 */
async function bindNewTabListener(browser) {
  browser.on(event.newTab.type, async function (e) {
    console.log('New Tab Created', e._targetInfo.url);

    const page = await common.switch_to_latest_tab(browser);
    await bindClickListener(page);
    // refresh the new page, make sure the script is running
    await common.refresh(page);
    await common.setViewport(page, 2540, 1318);

    // Differentiate what is operation by using a queue for synchronization.
    // Since the callback of operation 2 will happen immediately after operation 1,
    // so just a little delay here.
    const flag = await queue.eventClickTargetBlank.dequeueBlocking(page, 500);
    console.log('===>', flag);
    // If the return value is not equal to -1, It is operation 2,
    // otherwise it is operation 1.
    if (flag != -1) {
      // mark valid `click` event
      queue.eventValidClick.enqueue('⚡️');
    } else {
      // parse `newTab` event
      const stmt = parser.parseNewTab();
      await sender.sendData(stmt);
    }
  });
}

/**
 * Binding a browser-level listener for `closeTab` event, the listener catches
 * the event and executes the callback function when close the tab (window).
 * 
 * @param {puppeteer.Browser} browser - Browser instance launched via puppeteer.
 */
async function bindCloseTabListener(browser) {
  browser.on(event.closeTab.type, async function (e) {
    console.log('Tab Close', e._targetInfo.url);

    // parse `closeTab` event
    await common.switch_to_latest_tab(browser);
    if (!invalidURL.includes(e._targetInfo.url)) {
      const stmt = parser.parseCloseTab();
      await sender.sendData(stmt);
    }
  });
}

/**
 * Binding a browser-level listener for the `URLChange` event, the listener catches
 * the event and executes the callback function when the URL changes.
 * 
 * there are three operations that will trigger the `URLChange` event:
 *  1. click (target_self)
 *  2. new tab and manually enter the address
 *  3. directly enter the address manually
 * 
 * The callback of the `URLChange` event will be executed after the `click` event.
 * 
 * @param {puppeteer.Browser} browser - Browser instance launched via puppeteer.
 */
async function bindURLChangeListener(browser) {
  browser.on(event.URLChange.type, async function (e) {
    console.log('trigger url change:', e._targetInfo.url);

    // parse `URLChange` event
    await common.switch_to_latest_tab(browser);
    const stmt = parser.parseURLChange(e._targetInfo.url);
    await sender.sendData(stmt);
  });
}

/**
 * Run the listener.
 * 
 * @param {object} options - Configure of the puppeteer.
 */
async function run(options) {
  const browser = await pptr.launch(options);
  const page = await browser.newPage();

  // bind the listener (browser-level) for the `newTab` event
  await bindNewTabListener(browser);
  // bind the listener (browser-level) for the `closeTab` event
  await bindCloseTabListener(browser);
  // bind the listener (browser-level) for the `URLChange` event
  await bindURLChangeListener(browser);
  // bind the listener (page-level) for the `click` event
  await bindClickListener(page);

  await common.setViewport(page, 2540, 1318);
  await common.closeBlankPage(browser);
  common.initAllQueue();
}

(async () => {
  await run({
    'headless': false,
    'devtools': false,
    'executablePath': '/Applications/Chromium.app/Contents/MacOS/Chromium',
    args: [
      `--window-size=2540,1318`,
    ],
  });
})();