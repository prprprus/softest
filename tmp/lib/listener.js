const pptr = require('puppeteer');
const parser = require('./parser');
const sender = require('./sender');
const queue = require('../utils/queue');
const event = require('./event');
const common = require('../utils/common');

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
 * Binding a page-level listener for `click` event, the listener catches
 * the event and executes the callback function when the page is clicked.
 * 
 * Note: Since all clicks are captured, need to filter invalid clicks
 * (such as clicking the `<p>xxx</p>` element),
 * which is implemented by queue synchronization.
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

  // bind the listener (page-level) for the `clickTargetBlank` event
  await bindClickTargetBlankListener(page);
}

/**
 * Binding a browser-level listener for `newTab` event, the listener catches
 * the event and executes the callback function when open the tab (window).
 * 
 * There are two operations that will trigger the `newTab` event:
 *  1. new tab
 *  2. click (target_blank)
 * 
 * @param {puppeteer.Browser} browser - Browser instance launched via puppeteer.
 */
async function bindNewTabListener(browser) {
  browser.on(event.newTab.type, async function (e) {
    console.log('New Tab Created', e._targetInfo.url);

    let page = await common.switch_to_latest_tab(browser);
    // bind a listener (page-level) for `click` event of the new page
    await bindClickListener(page);
    // refresh the new page, make sure the script is running
    await common.refresh(page);
    // Set viewport for the new page
    await common.setViewport(page, 2540, 1318);

    // Differentiate what is operation by using a queue for synchronization.
    // Since the callback of operation 2 will happen immediately after operation 1,
    // so just a little delay here.
    let flag = await queue.eventClickTargetBlank.dequeueBlocking(page, 1000);
    console.log('===>', flag);
    // if the return value is not equal to -1, It is operation 2, otherwise it is operation 1
    if (flag != -1) {
      // mark valid `click` event
      queue.eventValidClick.enqueue('⚡️');
    } else {

      // todo
      // const statement = parseNewTab();
      // sendData(statement);

      return;
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
    let page = await common.switch_to_latest_tab(browser);

    // todo
    // const statement = parseCloseTab();
    // sendData(statement);
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
 * Here, only need to recognize 1 and 3, because 2 will be recognized by 
 * `bindNewTabListener` and `bindClickTargetBlankListener`.
 *  
 * For 1 and 3, it depends on whether the page listener has caught the click event.
 * If the click event is caught, it is operation 1, otherwise, it is operation 3.
 * 
 * Normally, the callback of the `URLChange` event will be executed before
 * the `click` event but when the network environment is slow,
 * the result may be reversed, so need to use the queue for synchronization.
 * 
 * @param {puppeteer.Browser} browser - Browser instance launched via puppeteer.
 */
async function bindURLChangeListener(browser) {
  browser.on(event.URLChange.type, async function (e) {
    console.log('trigger url change:', e._targetInfo.url);

    let page = await common.switch_to_latest_tab(browser);
    // mark valid `click` event (suppose)
    queue.eventValidClick.enqueue('⚡️');
    // mark operation 1
    queue.eventClickTargetSelf.enqueue('🚀');

    // if the return value is not equal to -1, It is operation 1, otherwise it is operation 2 or operation 3
    let info = await queue.eventClickTargetSelfCoordinates.dequeueBlocking(page, 80000);
    console.log('===> info recv ', info);
    if (info != -1) {
      // Since the operation 1 will destroy the original document, so cannot
      // parse the XPath in the callback of the `click` event and need to
      // parse the XPath here.

      // todo
      // const statement = parseClickTargetSelf();
      // sendData(statement);

      return;
    } else {
      // rollback of messages generated by operation 2 or operation 3
      queue.eventValidClick.dequeue();
      queue.eventClickTargetSelf.dequeue();
    }
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
  await page.goto('http://www.qq.com', {
    waitUntil: 'networkidle0'
  });
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