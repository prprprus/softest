// const puppeteer = require('puppeteer');
// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false
//   })
//   const page = await browser.newPage()

//   const navigationPromise = page.waitForNavigation()

//   await page.goto('https://www.qq.com/?fromdefault')

//   await page.setViewport({
//     width: 2540,
//     height: 1318
//   })

//   await page.waitForSelector('.bd > #tab-news-01 > .yw-list > .news-top > a')
//   await page.click('.bd > #tab-news-01 > .yw-list > .news-top > a')

//   await navigationPromise

//   await page.waitForSelector('.qq_navWrap > .qq_nav > .nav-list > li:nth-child(2) > a')
//   await page.click('.qq_navWrap > .qq_nav > .nav-list > li:nth-child(2) > a')

//   await navigationPromise

//   await browser.close()
// })()

const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      `--window-size=2540,1318`,
    ],
  })
  let pages = await browser.pages();
  await pages[0].close();

  let page = await browser.newPage();
  await page.setViewport({
    width: 2540,
    height: 1318
  });

  let element = null;

  // begin.

  await page.goto('https://www.qq.com/?fromdefault', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  element = await page.$x('/html/body/div[1]/div[5]/div[2]/div[1]/div[2]/ul/li[1]/a');
  await element[0].click();
  await page.waitFor(3000);
  pages = await browser.pages();
  page = pages[pages.length - 1];
  await page.bringToFront();
  await page.setViewport({
    width: 2540,
    height: 1318
  });
  await page.waitFor(500);

  element = await page.$x('/html/body/div[1]/div/div/div[1]/ul/li[1]/a');
  await element[0].click();
  await page.waitFor(3000);
  pages = await browser.pages();
  page = pages[pages.length - 1];
  await page.bringToFront();
  await page.setViewport({
    width: 2540,
    height: 1318
  });
  await page.waitFor(500);

  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      let distance = 100;
      let scrollHeight = 30474;
      let timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, distance);
    });
  });
  await page.waitFor(1000);

  element = await page.$x('/html/body/div/div[4]/div[2]/div/div/ul[2]/li[162]/a/img');
  await element[0].click();
  await page.waitFor(3000);
  pages = await browser.pages();
  page = pages[pages.length - 1];
  await page.bringToFront();
  await page.setViewport({
    width: 2540,
    height: 1318
  });
  await page.waitFor(500);

  await page.close();
  pages = await browser.pages();
  page = pages[pages.length - 1];
  await page.bringToFront();
  await page.waitFor(500);

  await page.close();
  pages = await browser.pages();
  page = pages[pages.length - 1];
  await page.bringToFront();
  await page.waitFor(500);

  await page.close();
  pages = await browser.pages();
  page = pages[pages.length - 1];
  await page.bringToFront();
  await page.waitFor(500);

  element = await page.$x('/html/body/div[1]/div[5]/div[1]/div/div[2]/div[1]/ul[1]/li[1]/a');
  await element[0].click();
  await page.waitFor(3000);
  pages = await browser.pages();
  page = pages[pages.length - 1];
  await page.bringToFront();
  await page.setViewport({
    width: 2540,
    height: 1318
  });
  await page.waitFor(500);

  page = await browser.newPage();
  await page.setViewport({
    width: 2540,
    height: 1318
  });
  await page.waitFor(500);

  await page.goto('http://example.com/', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  await page.goto('https://www.iana.org/domains/reserved', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  await page.goto('https://tools.ietf.org/html/rfc2606', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  await page.goto('https://tools.ietf.org/html/rfc6761', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  await page.goto('https://tools.ietf.org/html/rfc2606', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  await page.goto('https://tools.ietf.org/html/rfc6761', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  await page.goto('https://tools.ietf.org/html/rfc2606', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  await page.goto('https://tools.ietf.org/html/rfc6761', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  await page.goto('https://tools.ietf.org/html/rfc2606', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  await page.goto('https://tools.ietf.org/html/rfc6761', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  await page.goto('https://tools.ietf.org/html/rfc2606', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  await page.goto('https://tools.ietf.org/html/rfc6761', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  await page.goto('https://tools.ietf.org/html/rfc2606', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  await page.goto('https://datatracker.ietf.org/doc/rfc2606/', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  await page.goto('https://datatracker.ietf.org/doc/rfc6761/', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  await page.goto('https://datatracker.ietf.org/doc/rfc1918/', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  await page.goto('https://datatracker.ietf.org/doc/rfc6761/', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  await page.goto('https://datatracker.ietf.org/doc/rfc1918/', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  await page.goto('https://datatracker.ietf.org/doc/rfc6761/', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  page = await browser.newPage();
  await page.setViewport({
    width: 2540,
    height: 1318
  });
  await page.waitFor(500);

  await page.goto('https://www.douban.com/', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  element = await page.$x('/html/body/div[1]/div[2]/form/span[1]/input');
  await element[0].type('123~!@#asdq', {
    delay: 100
  });
  await page.waitFor(3000);

  await page.close();
  pages = await browser.pages();
  page = pages[pages.length - 1];
  await page.bringToFront();
  await page.waitFor(500);

  await page.close();
  pages = await browser.pages();
  page = pages[pages.length - 1];
  await page.bringToFront();
  await page.waitFor(500);

  await page.close();
  pages = await browser.pages();
  page = pages[pages.length - 1];
  await page.bringToFront();
  await page.waitFor(500);

  element = await page.$x('/html/body/div[1]/div[5]/div[2]/div[1]/div[2]/ul/li[3]/a[2]');
  await element[0].click();
  await page.waitFor(3000);
  pages = await browser.pages();
  page = pages[pages.length - 1];
  await page.bringToFront();
  await page.setViewport({
    width: 2540,
    height: 1318
  });
  await page.waitFor(500);

  // await page.waitForNavigation();
  // await browser.close()
})()