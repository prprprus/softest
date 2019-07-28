const pptr = require('puppeteer');
const parser = require('./parser');
const sender = require('./sender');
const queue = require('../utils/queue');

uq = new queue.UniqueQueue();

async function reportEvent(page, info) {
  let xpath = await parser.parseXPath(page, info);
  await sender.sendData(page, xpath);
}

// this page is a new page
async function bindListener(page) {
  // 2. Add a |window.reportEvent| function in the page that will simply log
  // passed object to Node.js console
  try {
    await page.exposeFunction('reportEvent', (info) => {
      reportEvent(page, info);
    });
  } catch (e) {
    console.log('⚠️ Repeat binding listener, return.');
    // don't need add click listener
    return;
  }

  // if not repeat binding...
  // 3. Hook document with capturing event listeners that sniff all the important
  // information from the event and report it back to Node.js
  await page.evaluateOnNewDocument(() => {
    console.log('in evaluateOnNewDocument...');
    document.addEventListener('click', e => reportEvent({
      targetName: e.target.tagName,
      eventType: 'click',
      x: e.clientX,
      y: e.clientY,
      d: console.log(e),
    }), true /* capture */ );
  });

  // bind page listener
  page.on('popup', function (e) {
    console.log("❤️️️️️️❤️❤️");
    // put flag into queue
    uq.enqueue('🔥');
  });
}

async function main() {
  // 1. Launch browser in headful mode so that we can click around and see how
  // script works.
  const browser = await pptr.launch({
    headless: false,
    devtools: true,
    // executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
  });
  let page = await browser.newPage();

  // register browser events
  browser.on('targetcreated', function (e) {
    console.log('New Tab Created');
    // console.log(e);
    (async () => {
      // switch tab
      let pages = await browser.pages();
      let newPage = pages[pages.length - 1];
      await newPage.bringToFront();
      console.log('页面数量：', pages.length);

      // bind listener
      await bindListener(newPage);
      await newPage.waitFor(1000);
      await newPage.evaluate(() => {
        location.reload(true);
      });
      await newPage.waitFor(1000);

      // delay parse
      // 如果返回的 flag 不是 🔥 就证明这次的 click 属于 new tab
      setTimeout(() => {

      }, 3000);
      console.log('===>', uq.dequeue());
    })();
  });
  browser.on('targetdestroyed', function (e) {
    console.log('Tab Close');
    (async () => {
      // switch tab
      let pages = await browser.pages();
      let newPage = pages[pages.length - 1];
      await newPage.bringToFront();
      console.log('页面数量：', pages.length);

      // parse
    })();
  });
  browser.on('targetchanged', function (e) {
    // console.log(e);
    console.log('url change');
    console.log(e._targetInfo.url);

    // parse
  });
  page.on('popup', function (e) {
    console.log("❤️️️️️️❤️❤️");
    // put flag into queue
    // uq.enqueue('🔥');
  });

  // bind listener
  await bindListener(page);

  // 4. Navigate the page; try clicking around the website.
  await page.goto('https://www.qq.com');

  // // test url change
  // const elm = await page.$x('/html/body/div/p[2]/a');
  // await elm[0].click();
  // await page.waitFor(10000);

  // let pages = await browser.pages();
  // page = pages[pages.length - 1];
  // await page.bringToFront();
  // await page.goBack();
  // await page.waitFor(10000);

  // pages = await browser.pages();
  // page = pages[pages.length - 1];
  // await page.bringToFront();
  // await page.goForward();
  // await page.waitFor(5000);
}

main();