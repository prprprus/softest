const common = require('../utils/common');
const queue = require('../utils/queue');
const pptr = require('puppeteer');
const error = require('../utils/error');

var browser = null;
var page = null;

beforeAll(async () => {
  const options = {
    headless: true,
    devtools: false,
    executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium',
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
    page = await common.switch_to_latest_tab(browser);
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
      await common.setViewport(page, 1265, 1400);
    } catch (e) {
      expect(e).toBe(error.viewport);
    }
  });
  it('should set viewport', async () => {
    await common.setViewport(page, 1265, 1400);
  });
});

describe('refresh', () => {
  it('should refresh', async () => {
    page = await common.switch_to_latest_tab(browser);
    await page.goto('http://www.example.com', {
      waitUntil: 'networkidle0'
    });
    const beforElm = await page.$x('/html/body/div/h1');
    const beforText = await page.evaluate(beforElm => beforElm.textContent, beforElm[0]);
    await common.refresh(page);
    page = await common.switch_to_latest_tab(browser);
    await page.waitFor(2000);
    const afterElm = await page.$x('/html/body/div/h1');
    const afterText = await page.evaluate(afterElm => afterElm.textContent, afterElm[0]);
    expect(beforText).toBe(afterText);
  });
});

describe('closeBlankPage', () => {
  it('should close default blank page', async () => {
    await common.closeBlankPage(browser);
  });
});

describe('initAllQueue', () => {
  it('should length is 0', () => {
    common.initAllQueue();
    expect(queue.clickTargetBlank.length()).toBe(0);
    expect(queue.validClick.length()).toBe(0);
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
    page = await common.switch_to_latest_tab(browser);
    const xpath = await common.getXPathByElement(page, info);
    expect(xpath).toBe('/html/body/div/h1');
  });
});

describe('addFormatFunction', () => {
  it('should add format function', () => {
    common.addFormatFunction();
    expect('hello {}'.format('softest')).toBe('hello softest');
  });
})

describe('formatData', () => {
  it('should return json format', () => {
    expect(common.formatData('x', 'y', 'z', 'q')).toEqual(JSON.stringify({
      statement: 'x',
      log: {
        time: 'y',
        operation: 'z',
        target: 'q'
      }
    }));
  });
});

describe('getCurrentDateTime', function () {
  it('should not equal', () => {
    const start = common.getCurrentDateTime();
    expect(start).toBe(common.getCurrentDateTime());
  });
});