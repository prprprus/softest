const bosr = require('../src/utils/browser');
const pptr = require('puppeteer');
const error = require('../src/utils/error');

var browser = null;
var page = null;

beforeAll(async () => {
  const options = {
    headless: true,
    devtools: false,
    args: [
      `--window-size=1265,1400`,
    ],
  }
  browser = await pptr.launch(options);
  page = await browser.newPage();
});

afterAll(async () => {
  await browser.close();
});

describe('switch_to_latest_tab', () => {
  it('should switch to latest tab', async () => {
    await browser.newPage();
    await browser.newPage();
    await browser.newPage();
    page = await bosr.switch_to_latest_tab(browser);
    await page.goto('http://www.example.com', {
      waitUntil: 'networkidle0'
    });
    const elm = await page.$x('/html/body/div/h1');
    const text = await page.evaluate(elm => elm.textContent, elm[0]);
    expect(text).toBe('Example Domain');
  });
});

describe('setViewport', () => {
  it('should return error.viewport', async () => {
    try {
      await bosr.setViewport(page, 1265, 1400);
    } catch (e) {
      expect(e).toBe(error.viewport);
    }
  });
  it('should set viewport', async () => {
    await bosr.setViewport(page, 1265, 1400);
  });
});

describe('refresh', () => {
  it('should refresh', async () => {
    page = await bosr.switch_to_latest_tab(browser);
    await page.goto('http://www.example.com', {
      waitUntil: 'networkidle0'
    });
    const beforElm = await page.$x('/html/body/div/h1');
    const beforText = await page.evaluate(beforElm => beforElm.textContent, beforElm[0]);
    await bosr.refresh(page);
    page = await bosr.switch_to_latest_tab(browser);
    await page.waitFor(2000);
    const afterElm = await page.$x('/html/body/div/h1');
    const afterText = await page.evaluate(afterElm => afterElm.textContent, afterElm[0]);
    expect(beforText).toBe(afterText);
  });
});

describe('closeBlankPage', () => {
  it('should close default blank page', async () => {
    await bosr.closeBlankPage(browser);
  });
});

describe('getXPathByElement', () => {
  it('should return XPath', async () => {
    const info = {
      targetName: 'a',
      eventType: 'click',
      x: 484,
      y: 172,
      scrollY: 500,
      type: 'click',
    }
    page = await bosr.switch_to_latest_tab(browser);
    const xpath = await bosr.getXPathByElement(page, info);
    expect(xpath).toBe('/html/body/div/h1');
  });
});