/**
 * queue module
 */
// timeoutParam is returned when the timeout parameter is negative
const timeoutParam = new Error('👉 The timeout parameter cannot be negative.');

/**
 * parser module
 */
// coordinatesParam is returned when the coordinates is negative
const coordinatesParam = new Error('👉 The coordinates cannot be negative.');
// eventType is returned when the event type is not click
const eventType = new Error('👉 The event type needs to be click.');

/**
 * proxy module
 */
// hostParam is returned when the type of host parameter is not a string
const hostParam = new Error('👉 Type of host parameter must be a string.');
// portParam is returned when the type of port parameter is not a number
const portParam = new Error('👉 Type of port parameter must be a number.');
// backlogParam is returned when the type of backlog parameter is not a number
const backlogParam = new Error('👉 Type of backlog parameter must be a number.');

/**
 * web module
 */
const writtenNumber = new Error('👉 The number of bytes written is inconsistent');
const writtenContent = new Error('👉 The content of writing is inconsistent');

module.exports = {
  timeoutParam,
  coordinatesParam,
  eventType,
  hostParam,
  portParam,
  backlogParam,
  writtenNumber,
  writtenContent,
}