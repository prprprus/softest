class Event {
  constructor(type, callbackName) {
    this.type = type
    this.callbackName = callbackName
  }
}

const clickEvent = new Event('click', 'clickEventCallback');
const pageBlankEvent = new Event('popup', 'pageBlankEventCallback');
const newTabEvent = new Event('targetcreated', 'newTabEventCallback');
const closeTabEvent = new Event('targetdestroyed', 'closeTabEventCallback');
const URLChangeEvent = new Event('targetchanged', 'URLChangeEventCallback');

module.exports = {
  clickEvent,
  pageBlankEvent,
  newTabEvent,
  closeTabEvent,
  URLChangeEvent,
}