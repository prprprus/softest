const pptr = require('puppeteer');
const WebSocket = require('ws');

// const ws = new WebSocket('ws://localhost:8080');

async function reportEvent(info, page) {
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

    const ws = new WebSocket('ws://localhost:8080');
    // send data to wss
    ws.on('open', function open() {
        console.log('send data to wss...');
        ws.send(xpath);
        ws.close();
    });
    await page.waitFor(1000);
    // receive data from wss
    // ws.on('message', function incoming(data) {
    //   console.log('receive from wss: %s', data);
    // });
}

async function bindListener(page) {
    // 2. Add a |window.reportEvent| function in the page that will simply log
    // passed object to Node.js console
    try {
        console.log('love❤️');
        await page.exposeFunction('reportEvent', (info) => {
            reportEvent(info, page);
        });
    } catch (e) {
        // await page.evaluate((reportEvent) => {
        //   document.removeEventListener('click', reportEvent, true);
        //   console.log('fuxk!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        // }, reportEvent);
        console.log('fuxk!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
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

            // bind listen
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
    });

    await bindListener(page);

    // 4. Navigate the page; try clicking around the website.
    await page.goto('https://www.qq.com');
}

main();

// ---

// // 'use strict';

// const puppeteer = require('puppeteer');

// function createXPathFromElement(elm) {
//   var allNodes = document.getElementsByTagName('*');
//   for (var segs = []; elm && elm.nodeType == 1; elm = elm.parentNode) {
//     if (elm.hasAttribute('id')) {
//       var uniqueIdCount = 0;
//       for (var n = 0; n < allNodes.length; n++) {
//         if (allNodes[n].hasAttribute('id') && allNodes[n].id == elm.id) uniqueIdCount++;
//         if (uniqueIdCount > 1) break;
//       };
//       if (uniqueIdCount == 1) {
//         segs.unshift('id("' + elm.getAttribute('id') + '")');
//         return segs.join('/');
//       } else {
//         segs.unshift(elm.localName.toLowerCase() + '[@id="' + elm.getAttribute('id') + '"]');
//       }
//     } else if (elm.hasAttribute('class')) {
//       segs.unshift(elm.localName.toLowerCase() + '[@class="' + elm.getAttribute('class') + '"]');
//     } else {
//       for (i = 1, sib = elm.previousSibling; sib; sib = sib.previousSibling) {
//         if (sib.localName == elm.localName) i++;
//       };
//       segs.unshift(elm.localName.toLowerCase() + '[' + i + ']');
//     };
//   };
//   return segs.length ? '/' + segs.join('/') : null;
// };

// 验证 xpath 的正确性
// (async function main() {
//   try {
//     const browser = await puppeteer.launch({headless: false});
//     const [page] = await browser.pages();

//     await page.goto('https://example.org/');
//     // await page.waitFor(15000);

//     // let e = await page.$x('/html/body/div/p[2]/a');
//     // const xpath = await page.evaluate(elm => {
//     //   var allNodes = document.getElementsByTagName('*');
//     //   for (var segs = []; elm && elm.nodeType == 1; elm = elm.parentNode) {
//     //     if (elm.hasAttribute('id')) {
//     //       var uniqueIdCount = 0;
//     //       for (var n = 0; n < allNodes.length; n++) {
//     //         if (allNodes[n].hasAttribute('id') && allNodes[n].id == elm.id) uniqueIdCount++;
//     //         if (uniqueIdCount > 1) break;
//     //       };
//     //       if (uniqueIdCount == 1) {
//     //         segs.unshift('id("' + elm.getAttribute('id') + '")');
//     //         return segs.join('/');
//     //       } else {
//     //         segs.unshift(elm.localName.toLowerCase() + '[@id="' + elm.getAttribute('id') + '"]');
//     //       }
//     //     } else if (elm.hasAttribute('class')) {
//     //       segs.unshift(elm.localName.toLowerCase() + '[@class="' + elm.getAttribute('class') + '"]');
//     //     } else {
//     //       for (i = 1, sib = elm.previousSibling; sib; sib = sib.previousSibling) {
//     //         if (sib.localName == elm.localName) i++;
//     //       };
//     //       segs.unshift(elm.localName.toLowerCase() + '[' + i + ']');
//     //     };
//     //   };
//     //   return segs.length ? '/' + segs.join('/') : null;
//     // }, e[0]);
//     // console.log(xpath);

//     console.log(await page.evaluate(() => {
//       let e =  document.elementFromPoint(144, 288);
//       e.click();
//     }));

//     // console.log(await page.evaluate(() => {
//     //   return document.elementsFromPoint(100, 100)
//     //     .map(({
//     //       tagName
//     //     }) => tagName).reverse().join(' > ');
//     // }));

//     // await browser.close();
//   } catch (err) {
//     console.error(err);
//   }
// })();