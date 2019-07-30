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
    // flag 说明: 🔥 代表 target_blank 跳转
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
      x: e.clientX,
      y: e.clientY,
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

    // 更新当前 url

    // flag 为 🔥 代表 target_blank 事件; flag 为 -1 代表 new tab 事件
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

    // 更新当前 url 为最后一个页面的 url
    console.log('🎉', page._target._targetInfo.url);

    // parse
  });
}

async function bindURLChangeEventListener(browser) {
  browser.on(event.URLChangeEvent.type, async function (e) {
    console.log('url change', e._targetInfo.url);
    // 标记有效点击
    queue.validClickEventQueue.enqueue('⚡️');
    // 标记是从 url change 事件过来的
    queue.clickTargetSelfEventQueue.enqueue('🚀');

    // 将 e.url 和当前页面的 url 比较如果不相同，则代表发生了 target_self 点击事件；
    // 更新当前 url；拿 xpath
    // 
    // ps: 两个特殊情况直接更新当前 url, 不用拿 xpath
    // New Tab Created chrome: //newtab/
    // New Tab Created chrome - devtools: //devtools/bundled/devtools_app.html?remote
    // Base = https: //chrome-devtools-frontend.appspot.com/serve_file/@aac427d544069
    // c29d53f89d960a06dbb512f24e1 / & can_dock = true & dockSide = undocked

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

  // 记录当前 url

  await page.goto('https://www.qq.com');

  // await page.goto('https://www.example.com', {
  //   waitUntil: 'networkidle0'
  // });
  // let pages = await browser.pages();
  // await pages[0].close();

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