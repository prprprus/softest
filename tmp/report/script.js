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

  await page.waitFor(3000);
  await browser.close();

  child_process.spawn('tar', ['zcvf', '/Users/tiger/develop/tmp/report.tar.gz', '/Users/tiger/develop/tmp/report']);
})();
