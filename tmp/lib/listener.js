const pptr = require('puppeteer');
const parser = require('./parser');
const sender = require('./sender');
const queue = require('../utils/queue');
const event = require('./event');

// common operation

async function switch_to_last_tab(browser) {
  let pages = await browser.pages();
  console.log('📃 ', pages.length);
  page = pages[pages.length - 1];
  await page.bringToFront();
  return page;
}

async function refresh(page) {
  await page.evaluate(() => {
    location.reload(true);
  });
}

// bind listener

async function clickEventCallback(browser, page, info) {
  let xpath = await parser.parseXPath(browser, page, info);
  if (xpath == -1) {
    return;
  }
  await sender.sendData(xpath);
}

async function bindclickTargetBlankEventListener(page) {
  page.on(event.clickTargetBlankEvent.type, function (e) {
    console.log("❤️️️️️️❤️❤️");
    // 标记 target_blank 事件
    queue.clickTargetBlankEventQueue.enqueue('🔥');
  });
}

async function bindClickEventListener(browser, page) {
  // Execute `clickEventCallback` when `clickEvent` is triggered
  try {
    await page.exposeFunction(event.clickEvent.callbackName, (info) => {
      (async () => {
        await clickEventCallback(browser, page, info);
      })();
    });
  } catch (e) {
    console.log('⚠️ Repeat binding listener, return.');
    // Don't need add click listener
    return;
  }

  // Register the `clickEventCallback` function for the `clickEvent`
  await page.evaluateOnNewDocument((clickEvent) => {
    console.log('in evaluateOnNewDocument...');
    document.addEventListener(clickEvent.type, (e) => clickEventCallback({
      targetName: e.target.tagName,
      eventType: clickEvent.type,
      // x: e.clientX,
      // y: e.clientY,
      x: e.pageX,
      y: e.pageY,
      d: console.log(e),
    }), true /* capture */ );
  }, event.clickEvent);

  // Bind the listener for the `clickTargetBlankEvent`
  await bindclickTargetBlankEventListener(page);
}

async function bindNewTabEventListener(browser) {
  browser.on(event.newTabEvent.type, async function (e) {
    console.log('New Tab Created', e._targetInfo.url);

    // switch tab and bind linstener
    let page = await switch_to_last_tab(browser);
    await bindClickEventListener(browser, page);
    await refresh(page);

    // 由于 new_tab 和 target_blank 都会触发 `newTabEvent`,
    // 所以加以区分, 如果 flag 为 🔥 代表 target_blank 事件, flag 为 -1 代表 new tab 事件.
    // 因为 target_blank 会紧随着 new_tab 事件触发，所以这里只需要等待 1s 就可以。
    let flag = await queue.clickTargetBlankEventQueue.dequeueBlocking(page, 1000);
    console.log('===>', flag);
    // 如果 != -1 就是 target_blank 事件；否则就是 new_tab 事件
    if (flag != -1) {
      queue.validClickEventQueue.enqueue('⚡️');
    }

    // parse
  });
}

async function bindCloseTabEventListener(browser) {
  browser.on(event.closeTabEvent.type, async function (e) {
    // console.log(e);
    console.log('Tab Close', e._targetInfo.url);
    let page = await switch_to_last_tab(browser);

    // 最后一个页面的 url
    // console.log('🎉', page._target._targetInfo.url);

    // parse
  });
}

async function bindURLChangeEventListener(browser) {
  browser.on(event.URLChangeEvent.type, async function (e) {
    console.log('url change', e._targetInfo.url);
    let page = await switch_to_last_tab(browser);

    // 标记有效点击
    queue.validClickEventQueue.enqueue('⚡️');

    // 标记是 target_self 事件
    queue.clickTargetSelfEventQueue.enqueue('🚀');

    // 考虑到网络延迟的因素，url change 的触发可能比 click 事件的触发要慢得多，
    // 所以这里必须要等待足够长的时间，而且要比 `fliterInvalidClickEvent` 长。
    let info = await queue.coordinatesQueue.dequeueBlocking(page, 80000);
    console.log('===> info recv ', info);

    // 地址栏输入引起的 url_change 事件要回滚
    if (info == -1) {
      queue.validClickEventQueue.dequeue();
      queue.clickTargetSelfEventQueue.dequeue();
    }
    console.log('✨', queue.validClickEventQueue.length());
    console.log('✨', queue.clickTargetSelfEventQueue.length());

    // parse
  });
}

// run
async function run(options) {
  const browser = await pptr.launch(options);
  const page = await browser.newPage();

  // bind listener
  await bindNewTabEventListener(browser);
  await bindCloseTabEventListener(browser);
  await bindURLChangeEventListener(browser);
  await bindClickEventListener(browser, page);

  // 记录当前 url

  await page.goto('http://douban.com', {
    waitUntil: 'networkidle0'
  });
  let pages = await browser.pages();
  await pages[0].close();
  // fix pptr 的 bug
  queue.clickTargetBlankEventQueue.dequeue();
  queue.validClickEventQueue.dequeue();
  queue.clickTargetSelfEventQueue.dequeue();
  queue.coordinatesQueue.dequeue();

  // close tab
  // await page.waitFor(3000);
  // await page.close();

  // open tab
  // const page1 = await browser.newPage();
  // await page1.goto('http://www.qq.com');
}

// tmp
(async () => {
  await run({
    'headless': false,
    'devtools': true,
    'executablePath': '/Applications/Chromium.app/Contents/MacOS/Chromium',
  });
})();