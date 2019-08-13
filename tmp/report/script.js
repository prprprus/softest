const puppeteer = require('puppeteer');
const child_process = require('child_process');

(async () => {
   const browser = await puppeteer.launch({
   headless: false,
     args: [
       `--window-size=1265, 1400`,
     ],
   });
   let pages = await browser.pages();
   await pages[0].close();

   let page = await browser.newPage();
   await page.setViewport({
     width: 1265,
     height: 1400
   });

   let element = null;
   let start = undefined;

await page.goto('https://www.qq.com/?fromdefault', {
  waitUntil: 'networkidle0',
});
await page.waitFor(1000);

await page.evaluate(async () => {
  await new Promise((resolve, reject) => {
    let totalHeight = 0;
    let distance = 100;
    let scrollHeight = document.body.scrollHeight;
    let timer = setInterval(() => {
      window.scrollBy(0, distance);
      totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
    }, 100);
  });
});
await page.waitFor(2000);
await page.screenshot({
  path: '/Users/tiger/develop/tmp/report/1565694373727.png',
  type: 'png',
  fullPage: true
});
await page.waitFor(500);

element = await page.$x('/html/body/div[1]/div[5]/div[2]/div[1]/div[2]/ul/li[1]/a');
await element[0].click();
await page.waitFor(3000);
pages = await browser.pages();
page = pages[pages.length - 1];
await page.bringToFront();
await page.setViewport({
  width: 1265,
  height: 1400
});
await page.waitFor(500);

await page.evaluate(async () => {
  await new Promise((resolve, reject) => {
    let totalHeight = 0;
    let distance = 100;
    let scrollHeight = document.body.scrollHeight;
    let timer = setInterval(() => {
      window.scrollBy(0, distance);
      totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
    }, 100);
  });
});
await page.waitFor(2000);
await page.screenshot({
  path: '/Users/tiger/develop/tmp/report/1565694379860.png',
  type: 'png',
  fullPage: true
});
await page.waitFor(500);

element = await page.$x('/html/body/div[1]/div/div/div[1]/ul/li[1]/a');
await element[0].click();
await page.waitFor(3000);
pages = await browser.pages();
page = pages[pages.length - 1];
await page.bringToFront();
await page.setViewport({
  width: 1265,
  height: 1400
});
await page.waitFor(500);

await page.evaluate(async () => {
  await new Promise((resolve, reject) => {
    let totalHeight = 0;
    let distance = 100;
    let scrollHeight = document.body.scrollHeight;
    let timer = setInterval(() => {
      window.scrollBy(0, distance);
      totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
    }, 100);
  });
});
await page.waitFor(2000);
await page.screenshot({
  path: '/Users/tiger/develop/tmp/report/1565694384818.png',
  type: 'png',
  fullPage: true
});
await page.waitFor(500);

await page.evaluate(async () => {
  await new Promise((resolve, reject) => {
    let totalHeight = 0;
    let distance = 100;
    let scrollHeight = 33715;
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


element = await page.$x('/html/body/div/div[4]/div[2]/div/div/ul[2]/li[179]/a/img');
await element[0].click();
await page.waitFor(3000);
pages = await browser.pages();
page = pages[pages.length - 1];
await page.bringToFront();
await page.setViewport({
  width: 1265,
  height: 1400
});
await page.waitFor(500);

await page.evaluate(async () => {
  await new Promise((resolve, reject) => {
    let totalHeight = 0;
    let distance = 100;
    let scrollHeight = document.body.scrollHeight;
    let timer = setInterval(() => {
      window.scrollBy(0, distance);
      totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
    }, 100);
  });
});
await page.waitFor(2000);
await page.screenshot({
  path: '/Users/tiger/develop/tmp/report/1565694405749.png',
  type: 'png',
  fullPage: true
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

element = await page.$x('//*[@id="sougouTxt"]');
await element[0].type('sadfs', {delay: 100});
await page.waitFor(3000);

element = await page.$x('//*[@id="searchBtn"]');
await element[0].click();
await page.waitFor(3000);
pages = await browser.pages();
page = pages[pages.length - 1];
await page.bringToFront();
await page.setViewport({
  width: 1265,
  height: 1400
});
await page.waitFor(500);

await page.close();
pages = await browser.pages();
page = pages[pages.length - 1];
await page.bringToFront();
await page.waitFor(500);

  await page.waitFor(3000);
  await browser.close();

  child_process.spawn('tar', ['zcvf', '/Users/tiger/develop/tmp/report.tar.gz', '/Users/tiger/develop/tmp/report']);
})();
