const puppeteer = require('puppeteer');

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
  path: '/Users/tiger/develop/tmp/script/1565538258940.png',
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
  path: '/Users/tiger/develop/tmp/script/1565538270923.png',
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
  path: '/Users/tiger/develop/tmp/script/1565538279203.png',
  type: 'png',
  fullPage: true
});
await page.waitFor(500);

await page.evaluate(async () => {
  await new Promise((resolve, reject) => {
    let totalHeight = 0;
    let distance = 100;
    let scrollHeight = 32898;
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


element = await page.$x('/html/body/div/div[4]/div[2]/div/div/ul[2]/li[177]/a/img');
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
  path: '/Users/tiger/develop/tmp/script/1565538296636.png',
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

page = await browser.newPage();
await page.setViewport({
  width: 1265,
  height: 1400
});
await page.waitFor(500);

await page.goto('https://www.douban.com/', {
  waitUntil: 'networkidle0',
});
await page.waitFor(1000);

element = await page.$x('/html/body/div[1]/div[2]/form/span[1]/input');
await element[0].type('123~!@#asd', {delay: 100});
await page.waitFor(3000);

await page.goto('https://www.douban.com/search?q=123%7E%21%40%23asd', {
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
  path: '/Users/tiger/develop/tmp/script/1565538333157.png',
  type: 'png',
  fullPage: true
});
await page.waitFor(500);

page = await browser.newPage();
await page.setViewport({
  width: 1265,
  height: 1400
});
await page.waitFor(500);

await page.goto('https://www.taptap.com/', {
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
  path: '/Users/tiger/develop/tmp/script/1565538350190.png',
  type: 'png',
  fullPage: true
});
await page.waitFor(500);

await page.goto('https://www.taptap.com/category/e1773', {
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
  path: '/Users/tiger/develop/tmp/script/1565538361046.png',
  type: 'png',
  fullPage: true
});
await page.waitFor(500);

await page.goto('https://www.taptap.com/app/64514', {
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
  path: '/Users/tiger/develop/tmp/script/1565538369454.png',
  type: 'png',
  fullPage: true
});
await page.waitFor(500);

await page.goto('https://www.taptap.com/app/62238', {
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
  path: '/Users/tiger/develop/tmp/script/1565538380751.png',
  type: 'png',
  fullPage: true
});
await page.waitFor(500);

page = await browser.newPage();
await page.setViewport({
  width: 1265,
  height: 1400
});
await page.waitFor(500);

await page.goto('https://www.bilibili.com/', {
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
  path: '/Users/tiger/develop/tmp/script/1565538395608.png',
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

  await page.waitFor(3000);
  await browser.close()
})();
