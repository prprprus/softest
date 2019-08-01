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

async function bindClickEventListener(browser, page) {
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

async function bindNewTabEventListener(browser) {
  browser.on(event.newTab.type, async function (e) {
    console.log('New Tab Created', e._targetInfo.url);

    // switch tab and bind linstener
    let page = await common.switch_to_latest_tab(browser);
    await bindClickEventListener(browser, page);
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

async function bindURLChangeEventListener(browser) {
  browser.on(event.URLChange.type, async function (e) {
    console.log('url change', e._targetInfo.url);
    let page = await common.switch_to_latest_tab(browser);

    // 标记有效点击
    queue.eventValidClick.enqueue('⚡️');

    // 标记是 target_self 事件
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

  // bind browser listener
  await bindNewTabEventListener(browser);
  await bindCloseTabEventListener(browser);
  await bindURLChangeEventListener(browser);

  // // bind page listener
  await bindClickEventListener(browser, page);

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
    // 'devtools': true,
    'executablePath': '/Applications/Chromium.app/Contents/MacOS/Chromium',
    args: [
      `--window-size=2540,1318`,
    ],
  });
})();