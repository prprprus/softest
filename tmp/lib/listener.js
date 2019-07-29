const pptr = require('puppeteer');
const parser = require('./parser');
const sender = require('./sender');
const queue = require('../utils/queue');
const event = require('./event');

// common browser operation

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

async function clickEventCallback(page, info) {
  let xpath = await parser.parseXPath(page, info);
  await sender.sendData(xpath);
}

async function bindpageBlankEventListener(page) {
  page.on(event.pageBlankEvent.type, function (e) {
    console.log("❤️️️️️️❤️❤️");
    // flag 说明: 🔥 代表 target_blank 跳转. ⚡️ 代表有效点击
    // put flag into queue
    queue.pageBlankEventQueue.enqueue('🔥');
  });
}

async function bindClickEventListener(page) {
  // Execute `clickEventCallback` when `clickEvent` is triggered
  try {
    await page.exposeFunction(event.clickEvent.callbackName, (info) => {
      (async () => {
        await clickEventCallback(page, info);
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
      x: e.clientX,
      y: e.clientY,
      d: console.log(e),
    }), true /* capture */ );
  }, event.clickEvent);

  // Bind the listener for the `pageBlankEvent`
  await bindpageBlankEventListener(page);
}

async function bindNewTabEventListener(browser) {
  browser.on(event.newTabEvent.type, async function (e) {
    console.log('New Tab Created');

    // switch tab and bind linstener
    let page = await switch_to_last_tab(browser);
    await bindClickEventListener(page);
    // await page.waitFor(500);
    await refresh(page);
    // await page.waitFor(500);

    // delay
    await page.waitFor(1000);
    // 识别有效点击事件
    let flag = queue.pageBlankEventQueue.dequeue();
    console.log('===>', flag);
    if (flag != -1) {
      queue.validClickQueue.enqueue('⚡️');
    }
    // parse
  });
}

async function bindCloseTabEventListener(browser) {
  browser.on(event.closeTabEvent.type, async function (e) {
    console.log('Tab Close');
    await switch_to_last_tab(browser);
    // parse
  });
}

async function bindURLChangeEventListener(browser) {
  browser.on(event.URLChangeEvent.type, async function (e) {
    console.log('url change');
    console.log(e._targetInfo.url);
    // 识别有效点击事件
    queue.validClickQueue.enqueue('⚡️');
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
  await bindClickEventListener(page);

  await page.goto('https://www.qq.com');

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