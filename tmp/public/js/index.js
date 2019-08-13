/**
 * Copyright(c) 2019, prprprus All rights reserved.
 * Use of this source code is governed by a BSD - style.
 * license that can be found in the LICENSE file.
 */

// Template of statement.

var templateStatementHead = `
const puppeteer = require('puppeteer');
const child_process = require('child_process');

(async () => {
   const browser = await puppeteer.launch({
   headless: false,
     args: [
       \`--window-size=1265, 1400\`,
     ],
   });
   let pages = await browser.pages();
   await pages[0].close();

   let page = await browser.newPage();
   await page.setViewport({
     width: 1265,
     height: 1400
   });

   let element = null;
   let start = undefined;

`;

var templateLogHead = '[time]                 [operation]     [target]\n';

var templateScreenshot = `
await page.evaluate(async () => {
  await new Promise((resolve, reject) => {
    let totalHeight = 0;
    let distance = 100;
    let scrollHeight = document.body.scrollHeight;
    let timer = setInterval(() => {
      window.scrollBy(0, distance);
      totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
    }, 100);
  });
});
await page.waitFor(2000);
await page.screenshot({
  path: '/Users/tiger/develop/tmp/report/{}.png',
  type: 'png',
  fullPage: true
});
await page.waitFor(500);

`;

var templateStatementEnd = `
  await page.waitFor(3000);
  await browser.close();

  child_process.spawn('tar', ['zcvf', '/Users/tiger/develop/tmp/report.tar.gz', '/Users/tiger/develop/tmp/report']);
})();
`;

/**
 * Get current date time.
 * E.g: 2019-08-13 18:29:03
 * 
 * @return {string}
 */
function getCurrentDateTime() {
    const today = new Date();
    const date = today.getFullYear() + '-' + fill0((today.getMonth() + 1)) + '-' + fill0(today.getDate());
    const time = fill0(today.getHours()) + ":" + fill0(today.getMinutes()) + ":" + fill0(today.getSeconds());
    return date + ' ' + time;
}

/**
 * Fill 0.
 * 
 * @param {number} num - Date or time.
 * @return {string}
 */
function fill0(num) {
    if (num < 10) {
        return '0' + num.toString();
    }
    return num;
}

/**
 * Add format function for string type.
 * 
 * @return {string}
 */
function addFormatFunction() {
    String.prototype.format = function () {
        let i = 0;
        const args = arguments;
        return this.replace(/{}/g, function () {
            return typeof args[i] != 'undefined' ? args[i++] : '';
        });
    };
}

// Make syntax highlight.
function makeHighlight() {
    document.querySelectorAll('pre').forEach((block) => {
        if (block.id === 'code') {
            hljs.highlightBlock(block);
        }
    });
}

/**
 * Real-time display statement.
 * 
 * @param {string} statement - The statement to display.
 */
function displayStatement(statement) {
    let codeElement = document.getElementById('code');
    let subCode = document.createElement('pre');
    subCode.innerHTML += statement;
    subCode.style.paddingLeft = '59.5px';
    codeElement.appendChild(subCode);
}

/**
 * Real-time display log.
 * 
 * @param {string} log - The log to display.
 */
function displayLog(log) {
    let logElement = document.getElementById('log');

    let timeElement = document.createElement('code');
    timeElement.innerHTML += log.time + '    ';

    let operationElement = document.createElement('code');
    // operationElement.innerHTML += log.operation + '           ';
    operationElement.innerHTML += log.operation;
    operationElement.style.color = '#00FF00';

    let targetElement = document.createElement('code');
    targetElement.innerHTML += log.target + '\n';
    targetElement.style.color = '#FFFF00';
    if (log.operation !== 'screenshot') {
        targetElement.style.marginLeft = '90px';
    } else {
        targetElement.style.marginLeft = '50px';
    }
    logElement.appendChild(timeElement);
    logElement.appendChild(operationElement);
    logElement.appendChild(targetElement);
}

// Handle WebSocket connection.
function handleConnection() {
    const statementProxy = new WebSocket('ws://localhost:8080');

    statementProxy.addEventListener('open', function (event) {
        console.log('connect proxy server!');
    });

    statementProxy.addEventListener('message', function (event) {
        console.log('received data from proxy server %s', event.data);
        const res = JSON.parse(event.data);
        displayStatement(res.statement);
        makeHighlight();
        displayLog(res.log);
    });
}

// Init.
(() => {
    addFormatFunction();
    handleConnection();
})();

// Bind click event listener.
window.onload = function () {
    // record
    const element = document.getElementById('record');
    element.addEventListener('click', function (event) {
        fetch('http://localhost:3000/record')
            .then(function (res) {
                console.log('record: ', res.status);
                if (res.status === 200) {
                    // add `templateStatementHead`
                    const codeElement = document.getElementById('code');
                    codeElement.innerHTML = '';
                    let subCode = document.createElement('pre');
                    subCode.innerHTML += templateStatementHead;
                    subCode.style.paddingLeft = '35px';
                    codeElement.appendChild(subCode);
                    makeHighlight();
                    // add `templateLogHead`
                    const logElement = document.getElementById('log');
                    logElement.innerHTML = '';
                    logElement.innerHTML += templateLogHead;
                }
            });
    });

    // screenshot
    const screenshotElement = document.getElementById('screenshot');
    screenshotElement.addEventListener('click', function (event) {
        fetch('http://localhost:3000/screenshot')
            .then(function (res) {
                console.log('screenshot: ', res.status);
                if (res.status === 200) {
                    // add `templateScreenshot`
                    const codeElement = document.getElementById('code');
                    let subCode = document.createElement('pre');
                    const now = Date.now();
                    subCode.innerHTML += templateScreenshot.format(now);
                    subCode.style.paddingLeft = '59.5px';
                    codeElement.appendChild(subCode);
                    makeHighlight();
                    // display log
                    let log = {
                        time: getCurrentDateTime(),
                        operation: 'screenshot',
                        target: document.location.href,
                    }
                    displayLog(log);
                }
            });
    });

    // end
    const endElement = document.getElementById('end');
    endElement.addEventListener('click', function (event) {
        const codeElement = document.getElementById('code');
        if (codeElement.innerHTML.includes('puppeteer.launch({') && !codeElement.innerHTML.includes('browser.close();')) {
            // add `templateStatementEnd`
            let subCode = document.createElement('pre');
            subCode.innerHTML += templateStatementEnd;
            subCode.style.paddingLeft = '43px';
            codeElement.appendChild(subCode);
            makeHighlight();
            // POST
            const data = {
                statement: codeElement.textContent,
            }
            fetch('http://localhost:3000/end', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(res => {
                console.log('end: ', res.status);
            });
        }
    });

    // play
    const playElement = document.getElementById('play');
    playElement.addEventListener('click', function (event) {
        fetch('http://localhost:3000/play')
            .then(function (res) {
                console.log('play: ', res.status);
                if (res.status !== 200) {
                    alert('Nothing to play.');
                }
            });
    });

    // download
    const downloadElement = document.getElementById('download');
    downloadElement.addEventListener('click', function (event) {
        fetch('http://localhost:3000/download')
            .then(function (res) {
                console.log('download: ', res.status);
                if (res.status === 200) {
                    window.open('/download');
                } else {
                    alert('Nothing to download.');
                }
            });
    });
}