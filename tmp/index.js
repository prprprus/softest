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

  await page.goto('https://www.qq.com/?fromdefault')

  await page.setViewport({
    width: 2540,
    height: 1318
  })

  let element = null;

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

  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      let distance = 100;
      let scrollHeight = 33709;
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

  element = await page.$x('/html/body/div/div[4]/div[2]/div/div/ul[2]/li[174]/a/img[1]');
  await element[0].click();
  await page.waitFor(3000);
  pages = await browser.pages();
  page = pages[pages.length - 1];
  await page.bringToFront();
  await page.setViewport({
    width: 2540,
    height: 1318
  });

  // await page.waitForNavigation();
  // await browser.close()
})()