// common browser operation

/**
 * Switch the current page to the latest.
 * @param {puppeteer.Browser} browser - Browser instance launched via puppeteer.
 * @return {puppeteer.Page} Latest open page.
 */
async function switch_to_latest_tab(browser) {
  let pages = await browser.pages();
  console.log('📃 ', pages.length);
  page = pages[pages.length - 1];
  await page.bringToFront();
  return page;
}

async function setViewport(width, height) {
  // if () {

  // }
  await page.setViewport({
    width: 2540,
    height: 1318
  });
}

module.exports = {
  switch_to_latest_tab,
}