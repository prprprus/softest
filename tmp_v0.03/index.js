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
  let page = await browser.newPage()

  // https://tools.ietf.org/html/rfc2606
  // https://www.qq.com/?fromdefault
  await page.goto('https://www.example.com')

  await page.setViewport({
    width: 2540,
    height: 1318
  })

  let element = null;

  element = await page.$x('/html/body/div/p[2]/a');
  await element[0].click();
  await page.waitFor(3000);
  pages = await browser.pages();
  page = pages[pages.length - 1];
  await page.bringToFront();

  element = await page.$x('/html/body/div/div[1]/p[2]/a[2]');
  await element[0].click();
  await page.waitFor(3000);
  pages = await browser.pages();
  page = pages[pages.length - 1];
  await page.bringToFront();

  element = await page.$x('/html/body/div/pre[1]/a[1]');
  await element[0].click();
  await page.waitFor(3000);
  pages = await browser.pages();
  page = pages[pages.length - 1];
  await page.bringToFront();

  element = await page.$x('/html/body/div/pre[1]/a[1]');
  await element[0].click();
  await page.waitFor(3000);
  pages = await browser.pages();
  page = pages[pages.length - 1];
  await page.bringToFront();

  element = await page.$x('/html/body/div/span[3]/a');
  await element[0].click();
  await page.waitFor(3000);
  pages = await browser.pages();
  page = pages[pages.length - 1];
  await page.bringToFront();

  element = await page.$x('/html/body/div/pre[1]/a[1]');
  await element[0].click();
  await page.waitFor(3000);
  pages = await browser.pages();
  page = pages[pages.length - 1];
  await page.bringToFront();

  element = await page.$x('/html/body/div/span[3]/a');
  await element[0].click();
  await page.waitFor(3000);
  pages = await browser.pages();
  page = pages[pages.length - 1];
  await page.bringToFront();

  element = await page.$x('/html/body/div/pre[1]/a[1]');
  await element[0].click();
  await page.waitFor(3000);
  pages = await browser.pages();
  page = pages[pages.length - 1];
  await page.bringToFront();

  element = await page.$x('/html/body/div/span[3]/a');
  await element[0].click();
  await page.waitFor(3000);
  pages = await browser.pages();
  page = pages[pages.length - 1];
  await page.bringToFront();

  // await page.waitForNavigation();
  // await browser.close()
})()