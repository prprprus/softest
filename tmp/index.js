const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    headless: false
  })
  const page = await browser.newPage()

  const navigationPromise = page.waitForNavigation()

  await page.goto('https://www.qq.com/?fromdefault')

  await page.setViewport({
    width: 2540,
    height: 1318
  })

  await page.waitForSelector('.bd > #tab-news-01 > .yw-list > .news-top > a')
  await page.click('.bd > #tab-news-01 > .yw-list > .news-top > a')

  await navigationPromise

  await page.waitForSelector('.qq_navWrap > .qq_nav > .nav-list > li:nth-child(2) > a')
  await page.click('.qq_navWrap > .qq_nav > .nav-list > li:nth-child(2) > a')

  await navigationPromise

  await browser.close()
})()