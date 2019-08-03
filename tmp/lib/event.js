/**
 * Class Event refers to the event that needs to be captured,
 * caused by user behavior (such as clicks, new tabs, etc.)
 */
class Event {
  /**
   * Create an Event object.
   * 
   * @param {string} type - Type of event.
   */
  constructor(type) {
    this.type = type
  }
}

const click = new Event('click');
const clickTargetBlank = new Event('popup');
const newTab = new Event('targetcreated');
const closeTab = new Event('targetdestroyed');
const URLChange = new Event('targetchanged');
const clickTargetSelf = new Event(''); // Note: puppeteer does not provide a corresponding event, it belongs to `URLChange` event

module.exports = {
  click,
  clickTargetBlank,
  newTab,
  closeTab,
  URLChange,
  clickTargetSelf,
}