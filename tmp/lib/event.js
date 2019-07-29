class Event {
  constructor(type, callbackName) {
    this.type = type
    this.callbackName = callbackName
  }
}

module.exports = {
  Event,
}