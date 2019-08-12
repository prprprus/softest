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
 * @param {puppeteer.Page} page - The current page.
 * @param {object} info - Callback information for `click` event.
 */
async function clickCallback(page, info) {
  // parse `click` event
  const res = await parser.parseClick(page, info);
  if (res !== undefined) {
    const data = common.formatData(res[0], common.getCurrentDateTime(), 'click', res[1]);
    await sender.sendData(data);
  }
}

/**
 * Binding a page-level listener for `click` event, the listener catches
 * the event and executes the callback function when the page is clicked.
 * 
 * Note: All clicks are captured, need to filter invalid clicks.
 * 
 * @param {puppeteer.Page} page - The current page.
 */
async function bindClickListener(page) {
  try {
    // Expose the callback function of the `click` event in Nodejs environment,
    // when the `click` event is captured, switches back to the Nodejs environment
    // from the browser environment, and executes the callback function.
    await page.exposeFunction('exposeClickCallback', (info) => {
      (async () => {
        await clickCallback(page, info);
      })();
    });
  } catch (e) {
    console.log('⚠️ repeat binding `click` event listener');
    return;
  }

  // register the listener for the `click` event in the document
  await page.evaluateOnNewDocument((click) => {
    console.log('in evaluateOnNewDocument...');
    document.addEventListener(click.type, (e) => exposeClickCallback({
      targetName: e.target.tagName, // the tag name of the element
      eventType: click.type, // type of event
      x: e.clientX, // horizontal coordinate of the element
      y: e.clientY, // vertical coordinate of the element
      scrollY: e.pageY, // vertical height of the scroll
      type: e.target.type, // type of input tag
      d: console.log(e), // debug info
    }), true /* capture */ );
  }, event.click);
}

/**
 * Binding a page-level listener for `clickTargetBlank` event, the listener catches
 * the event and executes the callback function when the click (target_blank) operation occurs.
 * 
 * Note: The `clickTargetBlank` event will occur with the `newTab` event,
 * need to use queue synchronization to distinguish. See also `bindNewTabListener` annotate.
 * 
 * @param {puppeteer.Page} page - The current page.
 */
async function bindClickTargetBlankListener(page) {
  page.on(event.clickTargetBlank.type, function (e) {
    console.log("❤️️️️️️❤️❤️");
    // mark `clickTargetBlank` event
    queue.clickTargetBlank.enqueue('🔥');
  });
}

/**
 * The callback function of the `input` event.
 * 
 * @param {puppeteer.Page} page - The current page.
 * @param {object} info - Callback information for `input` event.
 */
async function inputCallback(page, info) {
  // parse `input` event
  const xpath = queue.input.dequeue();
  if (xpath !== -1) {
    const stmt = await parser.parseInput(xpath, info);
    const data = common.formatData(stmt, common.getCurrentDateTime(), 'input', xpath);
    await sender.sendData(data);
  }
}

/**
 * Binding a page-level listener for `input` event, the listener catches
 * the event and executes the callback function when the input operation occurs.
 * 
 * @param {puppeteer.Page} page - The current page.
 */
async function bindInputListener(page) {
  try {
    // Expose the callback function of the `input` event in Nodejs environment,
    // when the `input` event is captured, switches back to the Nodejs environment
    // from the browser environment, and executes the callback function.
    await page.exposeFunction('inputCallback', (info) => {
      (async () => {
        await inputCallback(page, info);
      })();
    });
  } catch (e) {
    console.log('⚠️ repeat binding `input` event listener');
    return;
  }

  // register the listener for the `input` event in the document
  await page.evaluateOnNewDocument((input) => {
    console.log('in evaluateOnNewDocument...');
    document.addEventListener(input.type, (e) => inputCallback({
      targetName: e.target.tagName, // the tag name of the element
      eventType: input.type, // type of event
      value: e.target.value, // value of input
      type: e.target.type, // type of input tag
      d: console.log(e), // debug info
      x: console.log(e.target.type),
      y: console.log(e.target.value),
    }), true /* capture */ );
  }, event.input);
}

/**
 * Binding a browser-level listener for `newTab` event, the listener catches
 * the event and executes the callback function when open the tab (window).
 * 
 * There are two operations that will trigger the `newTab` event:
 *  1. new tab
 *  2. click (target_blank)
 * 
 * If it is triggered by operation 2, the callback of the `newTab` event will be
 * executed after the `click` event, need to use queue synchronization.
 * 
 * @param {puppeteer.Browser} browser - Browser instance launched via puppeteer.
 */
async function bindNewTabListener(browser) {
  browser.on(event.newTab.type, async function (e) {
    console.log('New Tab Created', e._targetInfo.url);

    const page = await common.switch_to_latest_tab(browser);

    // bind the listener for the new page
    await bindClickListener(page);
    await bindClickTargetBlankListener(page);
    await bindInputListener(page);

    // refresh the new page, make sure the script is running
    await common.refresh(page);
    // set viewport for the new page
    await common.setViewport(page, 1265, 1400);

    // Differentiate what is operation by using a queue for synchronization,
    // since the callback of `clickTargetBlank` event will happen immediately
    // after `newTab` event, so just a little delay here.
    const flag = await queue.clickTargetBlank.dequeue(page, 500);
    console.log('===>', flag);
    // If the return value is not equal to -1, It is operation 2,
    // otherwise it is operation 1.
    if (flag != -1) {
      // mark valid `click` event
      queue.validClick.enqueue('⚡️');
    } else {
      // parse `newTab` event
      const stmt = parser.parseNewTab();
      const data = common.formatData(stmt, common.getCurrentDateTime(), 'new  ', 'window');
      await sender.sendData(data);
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
      const data = common.formatData(stmt, common.getCurrentDateTime(), 'close', 'window');
      await sender.sendData(data);
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
    const data = common.formatData(stmt, common.getCurrentDateTime(), 'goto ', e._targetInfo.url);
    await sender.sendData(data);
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

  // bind the listener for the browser
  await bindNewTabListener(browser);
  await bindCloseTabListener(browser);
  await bindURLChangeListener(browser);

  // bind the listener for the page
  await bindClickListener(page);
  await bindClickTargetBlankListener(page);
  await bindInputListener(page);

  await common.setViewport(page, 1265, 1400);
  await common.closeBlankPage(browser);
  common.initAllQueue();

  await page.evaluate(() => {
    const elements = document.getElementsByTagName('body');
    elements[0].style.cursor = 'crosshair';
  });
}

// tmp
function handleSIGINT(signal) {
  console.log(`Received ${signal}`);
}
process.on('SIGINT', handleSIGINT);

(async () => {
  await run({
    'headless': false,
    'devtools': false,
    'executablePath': '/Applications/Chromium.app/Contents/MacOS/Chromium',
    args: [
      `--window-size=1265,1400`,
    ],
  });

  // throw 'dddd';
})();