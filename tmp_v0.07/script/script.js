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
  path: '/Users/tiger/develop/tmp/script/1565496608253.png',
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
  path: '/Users/tiger/develop/tmp/script/1565496620309.png',
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
  path: '/Users/tiger/develop/tmp/script/1565496640222.png',
  type: 'png',
  fullPage: true
});
await page.waitFor(500);

await page.evaluate(async () => {
  await new Promise((resolve, reject) => {
    let totalHeight = 0;
    let distance = 100;
    let scrollHeight = 33232;
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


element = await page.$x('/html/body/div/div[4]/div[2]/div/div/ul[2]/li[179]/a/img[1]');
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
  path: '/Users/tiger/develop/tmp/script/1565496700320.png',
  type: 'png',
  fullPage: true
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

await page.goto('https://datatracker.ietf.org/doc/rfc1597/', {
  waitUntil: 'networkidle0',
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
  path: '/Users/tiger/develop/tmp/script/1565496725817.png',
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

await page.goto('https://www.baidu.com/', {
  waitUntil: 'networkidle0',
});
await page.waitFor(500);

element = await page.$x('//*[@id="kw"]');
await element[0].type('123~!@#asd', {delay: 100});
await page.waitFor(3000);

await page.goto('https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=123~!%40%23asd&rsv_pq=896c95e40004c558&rsv_t=ca5c4BdUB6qzDlQ%2BcvZHKtYhN%2Bff8W0TXcTaLsu6%2Fsu14roHWwFgi7K3AVo&rqlang=cn&rsv_enter=0&rsv_dl=tb&rsv_sug3=11&rsv_sug1=6&rsv_sug7=100&inputT=5910&rsv_sug4=6618', {
  waitUntil: 'networkidle0',
});
await page.waitFor(500);

page = await browser.newPage();
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
  path: '/Users/tiger/develop/tmp/script/1565496774346.png',
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
  path: '/Users/tiger/develop/tmp/script/1565496798427.png',
  type: 'png',
  fullPage: true
});
await page.waitFor(500);

await page.goto('https://www.taptap.com/app/139184', {
  waitUntil: 'networkidle0',
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
  path: '/Users/tiger/develop/tmp/script/1565496808164.png',
  type: 'png',
  fullPage: true
});
await page.waitFor(500);

await page.goto('https://www.taptap.com/app/71064', {
  waitUntil: 'networkidle0',
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
  path: '/Users/tiger/develop/tmp/script/1565496826820.png',
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
