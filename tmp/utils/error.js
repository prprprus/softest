// queue module
const errorTimeoutParam = new Error('❌: Timeout parameter cannot be negative.');

// parser module
const errorCoordinatesParam = new Error('❌: coordinates should be greater than zero.');
const errorEventType = new Error('❌: event type should be click.');

module.exports = {
  errorTimeoutParam,
  errorCoordinatesParam,
  errorEventType
}