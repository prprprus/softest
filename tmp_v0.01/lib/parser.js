const queue = require('../utils/queue');

function InterruptInvalidCoordinates(info) {
  if (info.x < 0 || info.y < 0) {
    throw 'Error: coordinates should be greater than zero.'
  }
  if (info.eventType != 'click') {
    throw 'Error: event type should be click.'
  }
}

async function fliterInvalidClickEvent(page, info) {
  let flag = await queue.validClickEventQueue.dequeueBlocking(page, 3000);
  console.log('👏', flag);
  console.log('👏', info.targetName);

  // Condition 1: Handling the error identification problem of opening the page for the first time.
  // Condition 2: Invalid click when flag is - 1.
  if ((flag != -1 && info.targetName == 'LI') || (flag == -1)) {
    return false;
  }
  return true;
}

async function parseXPath(page, info) {
  InterruptInvalidCoordinates(info);
  let res = await fliterInvalidClickEvent(page, info);
  if (!res) {
    return -1;
  }

  // parse XPath by element
  let xpath = await page.evaluate((info) => {
    console.log('info: ', info);
    // get element by coordinate
    let element = document.elementFromPoint(info.x, info.y);
    if (element && element.id)
      return '//*[@id="' + element.id + '"]';
    else {
      var paths = [];
      // Use nodeName (instead of localName) so namespace prefix is included (if any).
      for (; element && element.nodeType == Node.ELEMENT_NODE; element = element.parentNode) {
        var index = 0;
        var hasFollowingSiblings = false;
        for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
          // Ignore document type declaration.
          if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
            continue;
          if (sibling.nodeName == element.nodeName)
            ++index;
        }
        for (var sibling = element.nextSibling; sibling && !hasFollowingSiblings; sibling = sibling.nextSibling) {
          if (sibling.nodeName == element.nodeName)
            hasFollowingSiblings = true;
        }
        var tagName = (element.prefix ? element.prefix + ":" : "") + element.localName;
        var pathIndex = (index || hasFollowingSiblings ? "[" + (index + 1) + "]" : "");
        paths.splice(0, 0, tagName + pathIndex);
      }
      return paths.length ? "/" + paths.join("/") : null;
    }
  }, info);

  console.log('XPath: ', xpath);
  return xpath;
}

module.exports = {
  parseXPath
}