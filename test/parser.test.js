const parser = require('../lib/parser');
const error = require('../utils/error');
const statement = require('../lib/statement');

describe('checkCoordinates', () => {
  it('should return error.coordinatesParam', () => {
    const info = {
      targetName: 'a',
      eventType: 'click',
      x: -1,
      y: -2,
      scrollY: 500,
      type: 'click',
    }
    try {
      parser.checkCoordinates(info);
    } catch (e) {
      expect(e).toBe(error.coordinatesParam);
    }
  });
});

describe('isInput', () => {
  it('should return true', () => {
    const info = {
      targetName: 'INPUT',
      eventType: 'click',
      x: -1,
      y: -2,
      scrollY: 500,
      type: 'click',
      value: 'ddd'
    }
    expect(parser.isInput(info)).toBeTruthy();
  });
  it('should return false', () => {
    const info = {
      targetName: 'A',
      eventType: 'click',
      x: -1,
      y: -2,
      scrollY: 500,
      type: 'click',
      value: 'ddd'
    }
    expect(parser.isInput(info)).toBeFalsy();
  });
  it('should return false', () => {
    const info = {
      targetName: 'INPUT',
      eventType: 'click',
      x: -1,
      y: -2,
      scrollY: 500,
      type: 'submit',
      value: 'ddd'
    }
    expect(parser.isInput(info)).toBeFalsy();
  });
  it('should return false', () => {
    const info = {
      targetName: 'INPUT',
      eventType: 'click',
      x: -1,
      y: -2,
      scrollY: 500,
      type: 'click',
      value: ''
    }
    expect(parser.isInput(info)).toBeFalsy();
  });
});

describe('parseNewTab', () => {
  it('should return statement of `newTab` event', () => {
    const stmt = parser.parseNewTab();
    expect(stmt).toBe(statement.templateNewTab);
  });
});

describe('parseURLChange', () => {
  it('should return statement of `URLChange` event', () => {
    const stmt = parser.parseURLChange('http://www.qq.com');
    expect(stmt).toBe(statement.templateURLChange.format('http://www.qq.com'));
  });
});

describe('parseCloseTab', () => {
  it('should return statement of `closeTab` event', () => {
    const stmt = parser.parseCloseTab();
    expect(stmt).toBe(statement.templateCloseTab);
  });
});

describe('parseInput', () => {
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

  it('should return statement of `input` event without scroll', () => {
    const stmt = parser.parseInput(xpath, infoWithoutScroll);
    expect(stmt).toBe(statement.templateInput.format(xpath, value));
  });
  it('should return statement of `input` event with scroll', () => {
    const stmt = parser.parseInput(xpath, infoWithScroll);
    expect(stmt).toBe(statement.templateScroll.format(step, infoWithScroll.scrollY, scrollX) + statement.templateInput.format(xpath, value));
  });
});