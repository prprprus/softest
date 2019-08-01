const pptr = require('puppeteer');
const parser = require('./parser');
const sender = require('./sender');
const queue = require('../utils/queue');
const event = require('./event');
const common = require('../utils/common');

async function clickCallback(browser, page, info) {
  let xpath = await parser.parseXPath(browser, page, info);
  if (xpath == -1) {
    return;
  }
  await sender.sendData(xpath);
}

async function bindClickTargetBlankListener(page) {
  page.on(event.clickTargetBlank.type, function (e) {
    console.log("❤️️️️️️❤️❤️");
    // mark target_blank event occurs
    queue.eventClickTargetBlank.enqueue('🔥');
  });
}

async function bindClickListener(browser, page) {
  // execute `clickCallback` when `click` is triggered
  try {
    await page.exposeFunction('clickCallback', (info) => {
      (async () => {
        await clickCallback(browser, page, info);
      })();
    });
  } catch (e) {
    console.log('⚠️ Repeat binding listener, return.');
    // fix pptr bug, don't need add click listener
    return;
  }

  // register the `clickCallback` function for the `click`
  await page.evaluateOnNewDocument((click) => {
    console.log('in evaluateOnNewDocument...');
    document.addEventListener(click.type, (e) => clickCallback({
      targetName: e.target.tagName,
      eventType: click.type,
      x: e.clientX,
      y: e.clientY,
      d: console.log(e),
    }), true /* capture */ );
  }, event.click);

  // bind the listener for the `clickTargetBlank`
  await bindClickTargetBlankListener(page);
}

async function bindNewTabListener(browser) {
  browser.on(event.newTab.type, async function (e) {
    console.log('New Tab Created', e._targetInfo.url);

    // switch tab and bind linstener
    let page = await common.switch_to_latest_tab(browser);
    await bindClickListener(browser, page);
    // refresh
    await common.refresh(page);

    await common.setViewport(page, 2540, 1318);

    // 由于 new_tab 和 target_blank 都会触发 `newTab`,
    // 所以加以区分, 如果 flag 为 🔥 代表 target_blank 事件, flag 为 -1 代表 new tab 事件.
    // 因为 target_blank 会紧随着 new_tab 事件触发，所以这里只需要等待 1s 就可以。
    let flag = await queue.eventClickTargetBlank.dequeueBlocking(page, 1000);
    console.log('===>', flag);
    // 如果 != -1 就是 target_blank 事件；否则就是 new_tab 事件
    if (flag != -1) {
      queue.eventValidClick.enqueue('⚡️');
    }

    // parse
  });
}

async function bindCloseTabEventListener(browser) {
  browser.on(event.closeTab.type, async function (e) {
    console.log('Tab Close', e._targetInfo.url);
    let page = await common.switch_to_latest_tab(browser);

    // parse
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
 * @param {puppeteer.Browser} browser - Browser instance launched via puppeteer.
 */
async function bindURLChangeListener(browser) {
  browser.on(event.URLChange.type, async function (e) {
    console.log('trigger url change:', e._targetInfo.url);
    let page = await common.switch_to_latest_tab(browser);

    // Communication and synchronization between the `click` event callback function
    // and the `URLChange` event callback function through the queue.
    // 
    // mark valid click
    queue.eventValidClick.enqueue('⚡️');
    // mark click (target_self) operation
    queue.eventClickTargetSelf.enqueue('🚀');

    // 考虑到网络延迟的因素，url change 的触发可能比 click 事件的触发要慢得多，
    // 所以这里必须要等待足够长的时间，而且要比 `fliterInvalidClickEvent` 长。
    let info = await queue.eventClickTargetSelfCoordinates.dequeueBlocking(page, 80000);
    console.log('===> info recv ', info);

    // 地址栏输入引起的 url_change 事件要回滚
    if (info == -1) {
      queue.eventValidClick.dequeue();
      queue.eventClickTargetSelf.dequeue();
    }

    // parse
  });
}

/**
 * Run the listener.
 * @param {object} options - Configure of the puppeteer.
 */
async function run(options) {
  const browser = await pptr.launch(options);
  const page = await browser.newPage();

  // binding browser-level listener
  await bindNewTabListener(browser);
  await bindCloseTabEventListener(browser);
  await bindURLChangeListener(browser);

  // binding page-level listener
  await bindClickListener(browser, page);

  await common.setViewport(page, 2540, 1318);
  await page.goto('http://www.qq.com', {
    waitUntil: 'networkidle0'
  });
  await common.closeBlankPage(browser);

  // reinitialize queue
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