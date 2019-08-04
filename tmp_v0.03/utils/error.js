/**
 * queue module
 */
// timeoutParam is returned when the timeout parameter is negative
const timeoutParam = new Error('❌: timeout parameter cannot be negative.');

/**
 * parser module
 */
// coordinatesParam is returned when the coordinates is negative
const coordinatesParam = new Error('❌: coordinates cannot be negative.');
// eventType is returned when the event type is not click
const eventType = new Error('❌: the event type needs to be click.');

/**
 * wss module
 */
// hostParam is returned when the type of host parameter is not a string
const hostParam = new Error('❌: type of host parameter must be a string.');
// portParam is returned when the type of port parameter is not a number
const portParam = new Error('❌: type of port parameter must be a number.');
// backlogParam is returned when the type of backlog parameter is not a number
const backlogParam = new Error('❌: type of backlog parameter must be a number.');

module.exports = {
  timeoutParam,
  coordinatesParam,
  eventType,
  hostParam,
  portParam,
  backlogParam,
}