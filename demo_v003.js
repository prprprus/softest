// const pptr = require('puppeteer');
// const parser = require('./parser');
// const sender = require('./sender');
// const queue = require('../utils/queue');
// const event = require('./event');

// const uq = new queue.UniqueQueue();
// const clickEvent = new event.Event('click', 'clickEventCallback');

// async function clickEventCallback(page, info) {
//   let xpath = await parser.parseXPath(page, info);
//   await sender.sendData(xpath);
// }

// // keyboard up event
// // todo

// async function bindListener(page) {
//   // 2. Add a |window.reportEvent| function in the page that will simply log
//   // passed object to Node.js console
//   try {
//     await page.exposeFunction(clickEvent.callbackName, (info) => {
//       // reportEvent(page, info);
//       clickEventCallback(page, info);
//     });
//   } catch (e) {
//     console.log('⚠️ Repeat binding listener, return.');
//     // don't need add click listener
//     return;
//   }

//   // if not repeat binding...
//   // 3. Hook document with capturing event listeners that sniff all the important
//   // information from the event and report it back to Node.js
//   await page.evaluateOnNewDocument((clickEvent) => {
//     console.log('in evaluateOnNewDocument...');
//     document.addEventListener(clickEvent.type, (e) => clickEventCallback({
//       targetName: e.target.tagName,
//       eventType: clickEvent.type,
//       x: e.clientX,
//       y: e.clientY,
//       d: console.log(e),
//     }), true /* capture */ );
//   }, clickEvent);

//   // bind page listener
//   page.on('popup', function (e) {
//     console.log("❤️️️️️️❤️❤️");
//     // put flag into queue
//     uq.enqueue('🔥');
//   });
// }

// async function main() {
//   // 1. Launch browser in headful mode so that we can click around and see how
//   // script works.
//   const browser = await pptr.launch({
//     headless: false,
//     devtools: true,
//     // executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
//   });
//   let page = await browser.newPage();

//   // register browser events
//   browser.on('targetcreated', function (e) {
//     console.log('New Tab Created');
//     // console.log(e);
//     (async () => {
//       // switch tab
//       let pages = await browser.pages();
//       let newPage = pages[pages.length - 1];
//       await newPage.bringToFront();
//       console.log('页面数量：', pages.length);

//       // bind listener
//       await bindListener(newPage);
//       await newPage.waitFor(1000);
//       await newPage.evaluate(() => {
//         location.reload(true);
//       });
//       await newPage.waitFor(1000);

//       // delay parse
//       // 如果返回的 flag 不是 🔥 就证明这次的 click 属于 new tab
//       setTimeout(() => {

//       }, 3000);
//       console.log('===>', uq.dequeue());
//     })();
//   });
//   browser.on('targetdestroyed', function (e) {
//     console.log('Tab Close');
//     (async () => {
//       // switch tab
//       let pages = await browser.pages();
//       let newPage = pages[pages.length - 1];
//       await newPage.bringToFront();
//       console.log('页面数量：', pages.length);

//       // parse
//     })();
//   });
//   browser.on('targetchanged', function (e) {
//     // console.log(e);
//     console.log('url change');
//     console.log(e._targetInfo.url);

//     // parse
//   });

//   // bind listener
//   await bindListener(page);

//   // 4. Navigate the page; try clicking around the website.
//   await page.goto('https://www.qq.com');

//   // // test url change
//   // const elm = await page.$x('/html/body/div/p[2]/a');
//   // await elm[0].click();
//   // await page.waitFor(10000);

//   // let pages = await browser.pages();
//   // page = pages[pages.length - 1];
//   // await page.bringToFront();
//   // await page.goBack();
//   // await page.waitFor(10000);

//   // pages = await browser.pages();
//   // page = pages[pages.length - 1];
//   // await page.bringToFront();
//   // await page.goForward();
//   // await page.waitFor(5000);
// }

// main();

// ---

// const pptr = require('puppeteer');
// const parser = require('./parser');
// const sender = require('./sender');
// const queue = require('../utils/queue');
// const event = require('./event');

// class Listener {
//   constructor(options) {
//     this.options = options;
//     this.uq = new queue.UniqueQueue();

//     // event
//     this.clickEvent = new event.Event('click', 'clickEventCallback');
//     this.pageBlankEvent = new event.Event('popup', 'pageBlankEventCallback');
//     this.newTabEvent = new event.Event('targetcreated', 'newTabEventCallback');
//     this.closeTabEvent = new event.Event('targetdestroyed', 'closeTabEventCallback');
//     this.URLChangeEvent = new event.Event('targetchanged', 'URLChangeEventCallback');
//   }

//   async init() {
//     this.browser = await pptr.launch(this.options);
//     this.page = await this.browser.newPage();
//   }

//   async switch_to_last_tab() {
//     let pages = await browser.pages();
//     this.page = pages[pages.length - 1];
//     await this.page.bringToFront();
//     console.log('📃 ', pages.length);
//   }

//   async refresh() {
//     await this.page.evaluate(() => {
//       location.reload(true);
//     });
//   }

//   // callback

//   async clickEventCallback(info) {
//     let xpath = await parser.parseXPath(this.page, info);
//     await sender.sendData(xpath);
//   }

//   async pageBlankEventCallback(e) {
//     // console.log(e);
//     console.log("❤️️️️️️❤️❤️");
//     // put flag into queue
//     this.uq.enqueue('🔥');
//   }

//   async newTabEventCallback(e) {
//     // console.log(e);
//     console.log('New Tab Created');
//     console.log('==========================>', this.switch_to_last_tab);

//     // switch tab and bind linstener
//     await this.switch_to_last_tab();
//     await this.bindClickEventListener();
//     await this.page.waitFor(1000);
//     await this.refresh();
//     await this.page.waitFor(1000);

//     // delay and parse
//     // 如果返回的 flag 不是 🔥 就证明这次的 click 属于 new tab
//     setTimeout(() => {}, 3000);
//     console.log('===>', uq.dequeue());
//   }

//   async closeTabEventCallback(e) {
//     // console.log(e);
//     console.log('Tab Close');
//     // switch tab
//     await this.switch_to_last_tab();
//     // parse
//   }

//   async URLChangeEventCallback(e) {
//     // console.log(e);
//     console.log('url change');
//     console.log(e._targetInfo.url);
//     // parse
//   }

//   // bind listener

//   async bindpageBlankEventListener() {
//     this.page.on(this.pageBlankEvent.type, await this.pageBlankEventCallback);
//   }

//   async bindClickEventListener() {
//     // 2. Add a |window.reportEvent| function in the page that will simply log
//     // passed object to Node.js console
//     try {
//       await this.page.exposeFunction(this.clickEvent.callbackName, (info) => {
//         (async () => {
//           await this.clickEventCallback(info);
//         })();
//       });
//     } catch (e) {
//       console.log('⚠️ Repeat binding listener, return.');
//       // don't need add click listener
//       return;
//     }

//     // if not repeat binding...
//     // 3. Hook document with capturing event listeners that sniff all the important
//     // information from the event and report it back to Node.js
//     await this.page.evaluateOnNewDocument((clickEvent) => {
//       console.log('in evaluateOnNewDocument...');
//       document.addEventListener(clickEvent.type, (e) => this.clickEventCallback({
//         targetName: e.target.tagName,
//         eventType: clickEvent.type,
//         x: e.clientX,
//         y: e.clientY,
//         d: console.log(e),
//       }), true /* capture */ );
//     }, this.clickEvent);

//     // bind page listener
//     await this.bindpageBlankEventListener()
//   }

//   async bindNewTabEventListener() {
//     this.browser.on(this.newTabEvent.type, await this.newTabEventCallback);
//   }

//   async bindCloseTabEventListener() {
//     this.browser.on(this.closeTabEvent.type, await this.closeTabEventCallback)
//   }

//   async bindURLChangeEventListener() {
//     this.browser.on(this.URLChangeEvent.type, await this.URLChangeEventCallback)
//   }

//   // run
//   async run() {
//     await this.init();
//     this.bindNewTabEventListener();
//     // await this.bindCloseTabEventListener();
//     // await this.bindURLChangeEventListener();
//     // await this.bindClickEventListener();
//     await this.page.goto('https://www.qq.com');
//   }
// }

// // tmp, run listener
// (async () => {
//   const listener = new Listener({
//     'headless': false,
//     'devtools': true,
//     'executablePath': '/Applications/Chromium.app/Contents/MacOS/Chromium',
//   });
//   await listener.run();
// })();

// -- -

const pptr = require('puppeteer');
const parser = require('./parser');
const sender = require('./sender');
const queue = require('../utils/queue');
const event = require('./event');

const uq = new queue.UniqueQueue();

// event

const clickEvent = new event.Event('click', 'clickEventCallback');
const pageBlankEvent = new event.Event('popup', 'pageBlankEventCallback');
const newTabEvent = new event.Event('targetcreated', 'newTabEventCallback');
const closeTabEvent = new event.Event('targetdestroyed', 'closeTabEventCallback');
const URLChangeEvent = new event.Event('targetchanged', 'URLChangeEventCallback');

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

async function clickEventCallback(page, info) {
  let xpath = await parser.parseXPath(page, info);
  await sender.sendData(xpath);
}

async function bindpageBlankEventListener(page) {
  page.on(pageBlankEvent.type, function (e) {
    console.log("❤️️️️️️❤️❤️");
    // put flag into queue
    uq.enqueue('🔥');
  });
}

async function bindClickEventListener(page) {
  // Execute `clickEventCallback` when `clickEvent` is triggered
  try {
    await page.exposeFunction(clickEvent.callbackName, (info) => {
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
  }, clickEvent);

  // Bind the listener for the `pageBlankEvent`
  await bindpageBlankEventListener(page);
}

async function bindNewTabEventListener(browser) {
  browser.on(newTabEvent.type, async function (e) {
    console.log('New Tab Created');

    // switch tab and bind linstener
    let page = await switch_to_last_tab(browser);
    await bindClickEventListener(page);
    await page.waitFor(1000);
    await refresh(page);
    await page.waitFor(1000);

    // delay
    setTimeout(() => {}, 3000);
    // parse. 如果返回的 flag 不是 🔥 就证明这次的 click 属于 new tab
    console.log('===>', uq.dequeue());
  });
}

async function bindCloseTabEventListener(browser) {
  browser.on(closeTabEvent.type, async function (e) {
    console.log('Tab Close');
    await switch_to_last_tab(browser);
    // parse
  });
}

async function bindURLChangeEventListener(browser) {
  browser.on(URLChangeEvent.type, async function (e) {
    console.log('url change');
    console.log(e._targetInfo.url);
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
}

// tmp
(async () => {
  await run({
    'headless': false,
    'devtools': true,
    'executablePath': '/Applications/Chromium.app/Contents/MacOS/Chromium',
  });
})();