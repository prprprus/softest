class Statement {
  constructor(eventType) {
    this.eventType = eventType;
  }

  getStatement(xpath) {}
}

class ClickTargetBlank extends Statement {
  constructor(eventType) {
    super(eventType);
  }

  getStatement(xpath, info) {
    const scrollY = info.scrollY;
    const scrollX = 0;
    const step = 100;

    if (info.scrollY > 1000) {
      const statement = `
await page.evaluate(async () => {
  await new Promise((resolve, reject) => {
    let totalHeight = 0;
    let distance = ${step};
    let scrollHeight = ${scrollY};
    let timer = setInterval(() => {
      window.scrollBy(${scrollX}, distance);
      totalHeight += distance;
      if (totalHeight >= scrollHeight) {
        clearInterval(timer);
        resolve();
      }
    }, distance);
  });
});
await page.waitFor(1000);
element = await page.$x('${xpath}');
await element[0].click();
await page.waitFor(3000);
pages = await browser.pages();
page = pages[pages.length - 1];
await page.bringToFront();
await page.setViewport({
  width: 2540,
  height: 1318
});
    `
      return statement;
    } else {
      const statement = `
element = await page.$x('${xpath}');
await element[0].click();
await page.waitFor(3000);
pages = await browser.pages();
page = pages[pages.length - 1];
await page.bringToFront();
await page.setViewport({
  width: 2540,
  height: 1318
});
    `
      return statement;
    }
  }
}

class Switch extends Statement {
  constructor(eventType) {
    super(eventType);
  }

  getStatement() {

  }
}

class ClickTargetSelf extends Statement {
  constructor(eventType) {
    super(eventType);
  }
}

class OpenTab extends Statement {
  constructor(eventType) {
    super(eventType);
  }
}

class CloseTab extends Statement {
  constructor(eventType) {
    super(eventType);
  }
}

module.exports = {
  ClickTargetBlank,
}