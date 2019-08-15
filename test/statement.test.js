const statement = require('../src/core/statement');
const event = require('../src/core/event');

describe('ClickTargetBlank', () => {
  const xpath = '/html/body/div/div[4]/div[2]/div/div/ul[2]/li[179]/a/img';
  const infoWithoutScroll = {
    targetName: 'a',
    eventType: 'click',
    x: 66,
    y: 176,
    scrollY: 500,
    type: 'click',
  }
  const infoWithScroll = {
    targetName: 'a',
    eventType: 'click',
    x: 66,
    y: 176,
    scrollY: 1500,
    type: 'click',
  }
  const step = 100;
  const scrollX = 0;
  const ctb = new statement.ClickTargetBlank(event.clickTargetBlank);

  it('should return statement of `clickTargetBlank` event without scroll', () => {
    const stmt = ctb.getStatement(xpath, infoWithoutScroll);
    expect(stmt).toBe(statement.templateClickTargetBlank.format(xpath));
  });
  it('should return statement of `clickTargetBlank` event with scroll', () => {
    const stmt = ctb.getStatement(xpath, infoWithScroll);
    expect(stmt).toBe(statement.templateScroll.format(step, infoWithScroll.scrollY, scrollX) + statement.templateClickTargetBlank.format(xpath));
  });
});

describe('NewTab', () => {
  it('should return statement of `newTab` event', () => {
    const nt = new statement.NewTab(event.newTab);
    const stmt = nt.getStatement();
    expect(stmt).toBe(statement.templateNewTab);
  });
});

describe('URLChange', () => {
  it('should return statement of `URLChange` event', () => {
    const url = 'http://www.example.com';
    const uc = new statement.URLChange(event.URLChange);
    const stmt = uc.getStatement(url);
    expect(stmt).toBe(statement.templateURLChange.format(url));
  });
});

describe('CloseTab', () => {
  it('should return statement of `closeTab` event', () => {
    const ct = new statement.CloseTab(event.closeTab);
    const stmt = ct.getStatement();
    expect(stmt).toBe(statement.templateCloseTab);
  });
});

describe('Input', () => {
  const xpath = '/html/body/div/div[4]/div[2]/div/div/ul[2]/li[179]/a/img';
  const infoWithoutScroll = {
    targetName: 'a',
    eventType: 'click',
    x: 66,
    y: 176,
    scrollY: 500,
    type: 'click',
    value: '123~!@#asd',
  }
  const infoWithScroll = {
    targetName: 'a',
    eventType: 'click',
    x: 66,
    y: 176,
    scrollY: 1500,
    type: 'click',
    value: '123~!@#asd',
  }
  const step = 100;
  const scrollX = 0;
  const value = '123~!@#asd';
  const i = new statement.Input(event.input);

  it('should return statement of `input` event without scroll', () => {
    const stmt = i.getStatement(xpath, infoWithoutScroll);
    expect(stmt).toBe(statement.templateInput.format(xpath, value));
  });
  it('should return statement of `input` event with scroll', () => {
    const stmt = i.getStatement(xpath, infoWithScroll);
    expect(stmt).toBe(statement.templateScroll.format(step, infoWithScroll.scrollY, scrollX) + statement.templateInput.format(xpath, value));
  })
});