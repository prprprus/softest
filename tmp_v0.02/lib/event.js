class Event {
  constructor(type, callbackName) {
    this.type = type
    this.callbackName = callbackName
  }
}

const clickEvent = new Event('click', 'clickEventCallback');
const clickTargetBlankEvent = new Event('popup', '');
const newTabEvent = new Event('targetcreated', '');
const closeTabEvent = new Event('targetdestroyed', '');
const URLChangeEvent = new Event('targetchanged', '');

module.exports = {
  clickEvent,
  clickTargetBlankEvent,
  newTabEvent,
  closeTabEvent,
  URLChangeEvent,
}