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

  await page.goto('https://www.baidu.com/', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  element = await page.$x('//*[@id="kw"]');
  await element[0].type('yy7', {
    delay: 100
  });
  await page.waitFor(3000);

  await page.goto('https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=yy7&rsv_pq=d8be1931001233b4&rsv_t=9e8awbAnHHlb1IMeQWLmTWZUkraf%2F2kSjIbREZ8OJoYaoZFysOzaNrBl694&rqlang=cn&rsv_enter=0&rsv_dl=tb&rsv_sug3=4&rsv_sug1=2&rsv_sug7=100&inputT=2389&rsv_sug4=3464', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  await page.goto('https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=yy7&oq=yy7&rsv_pq=fb916f27000bcdd5&rsv_t=967b%2Bj%2FwBCM3eHBAeleZ5TRdHCqHFaq0xpM6O8xIZb9JIHfAzb3N%2Bu0CUBo&rqlang=cn&rsv_enter=0&rsv_dl=tb', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  await page.goto('https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=yy7&oq=yy7&rsv_pq=d7e2a2f8002f1ff4&rsv_t=98ceBv8ThFPqVS4bI0HSJ1yu84YO2PCprgNl9OHGlAgjoDivyzTpnLFSZQc&rqlang=cn&rsv_enter=0&rsv_dl=tb', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  await page.goto('https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=yy7&oq=yy7&rsv_pq=8cb8ec82000bc95b&rsv_t=7fd8%2BSeOXhBILn9f7%2FtdF4BPd85J7T%2F1pB6AdMrrkpM0iWcUUEx%2FWsHIMHA&rqlang=cn&rsv_enter=0&rsv_dl=tb', {
    waitUntil: 'networkidle0',
  });
  await page.waitFor(500);

  // await page.waitForNavigation();
  // await browser.close()
})()

// const viewPort = {
//   width: 1280,
//   height: 800
// }
// const options = {
//   path: 'clipped_stocktickers.png',
//   fullPage: false,
//   clip: {
//     x: 0,
//     y: 240,
//     width: 1000,
//     height: 100
//   }
// }

// const puppeteer = require('puppeteer');
// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false
//   })
//   const page = await browser.newPage()
//   await page.setViewport(viewPort)
//   await page.goto('https://finance.yahoo.com/')
//   await page.waitFor(60000)
//   await page.screenshot(options)
//   // await browser.close()
// })()