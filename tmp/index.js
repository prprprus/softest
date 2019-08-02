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
    headless: false
  })
  const page = await browser.newPage()

  const navigationPromise = page.waitForNavigation()

  await navigationPromise

  await page.goto('https://www.qq.com/?fromdefault')

  await page.setViewport({
    width: 2540,
    height: 1318
  })

  await page.waitForSelector('.mod > .bd > .news-list > .news-top > a')
  await page.click('.mod > .bd > .news-list > .news-top > a')

  await navigationPromise

  await page.waitForSelector('.qq_navWrap > .qq_nav > .nav-list > li:nth-child(1) > a')
  await page.click('.qq_navWrap > .qq_nav > .nav-list > li:nth-child(1) > a')

  await navigationPromise

  await page.waitForSelector('.channel_mod > .list > #\32 0190801A0592Z_179 > .picture > img')
  await page.click('.channel_mod > .list > #\32 0190801A0592Z_179 > .picture > img')

  await navigationPromise

  await browser.close()
})()