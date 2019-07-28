const pptr = require('puppeteer');
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

async function parseXPath(page, info) {
  // firebug
  let xpath = await page.evaluate((info) => {
    console.log('---> info: ', info);
    let element = document.elementFromPoint(144, 288);
    if (element && element.id)
      return '//*[@id="' + element.id + '"]';
    else {
      var paths = [];
      // Use nodeName (instead of localName) so namespace prefix is included (if any).
      for (; element && element.nodeType == Node.ELEMENT_NODE; element = element.parentNode) {
        var index = 0;
        var hasFollowingSiblings = false;
        for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
          // Ignore document type declaration.
          if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
            continue;
          if (sibling.nodeName == element.nodeName)
            ++index;
        }
        for (var sibling = element.nextSibling; sibling && !hasFollowingSiblings; sibling = sibling.nextSibling) {
          if (sibling.nodeName == element.nodeName)
            hasFollowingSiblings = true;
        }
        var tagName = (element.prefix ? element.prefix + ":" : "") + element.localName;
        var pathIndex = (index || hasFollowingSiblings ? "[" + (index + 1) + "]" : "");
        paths.splice(0, 0, tagName + pathIndex);
      }
      return paths.length ? "/" + paths.join("/") : null;
    }
  }, info);
  console.log(xpath);
  // let e = await page.$x(xpath);
  // await e[0].click();
  return xpath;
}

async function sendData(page, data) {
  // send data to wss
  ws.on('open', function open() {
    console.log('connected to wss...');
  });
  ws.send(data);
  await page.waitFor(500);
}

async function reportEvent(page, info) {
  let xpath = await parseXPath(page, info);
  await sendData(page, xpath);
}

async function bindListener(page) {
  // 2. Add a |window.reportEvent| function in the page that will simply log
  // passed object to Node.js console
  try {
    console.log('love❤️');
    await page.exposeFunction('reportEvent', (info) => {
      reportEvent(page, info);
    });
  } catch (e) {
    console.log('fuxk!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    // don't need add click listener
    return;
  }
  // 3. Hook document with capturing event listeners that sniff all the important
  // information from the event and report it back to Node.js
  console.log('before evaluateOnNewDocument...');
  await page.evaluateOnNewDocument(() => {
    console.log('in evaluateOnNewDocument...');
    document.addEventListener('click', e => reportEvent({
      targetName: e.target.tagName,
      eventType: 'click',
      x: e.clientX,
      y: e.clientY,
      d: console.log(e),
      t: e,
    }), true /* capture */ );
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
    })();
  });
  browser.on('targetchanged', function (e) {
    // console.log(e);
    console.log('url change');
    console.log(e._targetInfo.url);
  });
  page.on('popup', function (e) {
    console.log("=======================> ❤️️️️️️❤️❤️");
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