class Event {
  constructor(type, callbackName) {
    this.type = type
  }
}

const clickEvent = new Event('click');
const clickTargetBlankEvent = new Event('popup');
const newTabEvent = new Event('targetcreated');
const closeTabEvent = new Event('targetdestroyed');
const URLChangeEvent = new Event('targetchanged');

module.exports = {
  clickEvent,
  clickTargetBlankEvent,
  newTabEvent,
  closeTabEvent,
  URLChangeEvent,
}