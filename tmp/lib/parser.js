const queue = require('../utils/queue');

async function filterInvalidCoordinates(page, info) {
  if (info.x < 0 || info.y < 0) {
    throw 'Error: coordinates should be greater than zero.'
  }
  if (info.eventType != 'click') {
    throw 'Error: event type should be click.'
  }

  await page.waitFor(3000);
  let flag = queue.validClickQueue.dequeue();
  console.log('👏', flag);
  console.log('👏', info.targetName);
}

async function parseXPath(page, info) {
  await filterInvalidCoordinates(page, info);

  let xpath = await page.evaluate((info) => {
    console.log('info: ', info);
    // get element by coordinate
    let element = document.elementFromPoint(info.x, info.y);

    // parse XPath by element
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