const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            `--window - size = 1265, 1400 `,
        ],
    })
    let pages = await browser.pages();
    await pages[0].close();

    let page = await browser.newPage();
    await page.setViewport({
        width: 1265,
        height: 1400
    });

    let element = null;
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
  width: 1265,
  height: 1400
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
    let scrollHeight = 33059;
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

element = await page.$x('/html/body/div/div[4]/div[2]/div/div/ul[2]/li[175]/a/img[1]');
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
await page.goto('https://www.baidu.com/', {
  waitUntil: 'networkidle0',
});
await page.waitFor(500);
element = await page.$x('//*[@id="kw"]');
await element[0].type('123~!@#asd', {delay: 100});
await page.waitFor(3000);
await page.goto('https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=123~!%40%23asd&rsv_pq=f7bdc1a40011e326&rsv_t=8913XOzrrHO34hFKa8G%2BXrdzdBEM9kxuzT5qzqfM%2FB73A9%2Fdf7aKdXHDDvI&rqlang=cn&rsv_enter=0&rsv_dl=tb&rsv_sug3=11&rsv_sug1=9&rsv_sug7=100&inputT=6111&rsv_sug4=7161', {
  waitUntil: 'networkidle0',
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
await page.goto('https://www.taptap.com/app/57581', {
  waitUntil: 'networkidle0',
});
await page.waitFor(500);
await page.goto('https://www.taptap.com/app/60333', {
  waitUntil: 'networkidle0',
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

        await page.waitFor(3000);
        await browser.close()
    })();
