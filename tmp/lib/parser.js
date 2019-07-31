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
  // 考虑到网络延迟的因素，url change 的触发可能比 click 事件的触发要慢得多，
  // 所以这里必须要等待足够长的时间。
  let flag = await queue.validClickEventQueue.dequeueBlocking(page, 40000);
  console.log('👏', flag);
  console.log('👏', info.targetName);

  // Condition 1: Handling the error identification problem of opening the page for the first time.
  // Condition 2: Invalid click when flag is -1.
  if ((flag != -1 && info.targetName == 'LI') || (flag == -1)) {
    return false;
  }
  return true;
}

async function handleclickTargetSelfEvent(page) {
  console.log('原来长度:', queue.clickTargetSelfEventQueue.length());
  // 有了 `fliterInvalidClickEvent` 的等待作为保证，这里只需要意思意思就可以。
  let flag = await queue.clickTargetSelfEventQueue.dequeueBlocking(page, 1000);
  console.log('剩下长度:', queue.clickTargetSelfEventQueue.length());
  console.log('👺', flag);
  if (flag != -1) {
    return false;
  }
  return true
}

async function parseXPath(browser, page, info) {
  InterruptInvalidCoordinates(info);
  let res = await fliterInvalidClickEvent(page, info);
  if (!res) {
    return -1;
  }

  res = await handleclickTargetSelfEvent(page);
  if (!res) {
    console.log('===> info send ', info);
    queue.coordinatesQueue.enqueue(info);
    return;
  }

  // parse XPath by element
  let xpath = await page.evaluate((info) => {
    console.log('info: ', info);

    // tmp
    // var elements = [];
    // var display = [];
    // var item = document.elementFromPoint(info.x, info.y);
    // while (item && item !== document.body && item !== window && item !== document && item !== document.documentElement) {
    //   elements.push(item);
    //   display.push(item.style.display);
    //   item.style.display = "none";
    //   item = document.elementFromPoint(info.x, info.y);
    // }
    // // restore display property
    // for (var i = 0; i < elements.length; i++) {
    //   elements[i].style.display = display[i];
    // }
    // console.log('=>fuxk', elements);

    // tmp
    window.scrollBy(info.x, info.y);

    // get element by coordinate
    let element = document.elementFromPoint(info.x, info.y);

    if (element && element.id)
      return '//*[@id="' + element.id + '"]';
    else {
      var paths = [];
      console.log(info.x, info.y);
      console.log(element);
      console.log('=>fuxk', element.nodeType);
      console.log('=>fuxk', Node.ELEMENT_NODE);
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
      console.log('🐢', paths);
      return paths.length ? "/" + paths.join("/") : null;
    }
  }, info);

  console.log('XPath: ', xpath);
  return xpath;
}

module.exports = {
  parseXPath
}