class Event {
  constructor(type) {
    this.type = type
  }
}

const click = new Event('click');
const clickTargetBlank = new Event('popup');
const newTab = new Event('targetcreated');
const closeTab = new Event('targetdestroyed');
const URLChange = new Event('targetchanged');

module.exports = {
  click,
  clickTargetBlank,
  newTab,
  closeTab,
  URLChange,
}