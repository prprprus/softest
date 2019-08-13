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
 * Add format function to string.
 */
function addFormat() {
    String.prototype.format = function () {
        let i = 0;
        const args = arguments;
        return this.replace(/{}/g, function () {
            return typeof args[i] != 'undefined' ? args[i++] : '';
        });
    };
}

/**
 * Handle WebSocket connection.
 */
function handleConnection() {
    // create WebSocket connection
    const statementProxy = new WebSocket('ws://localhost:8080');

    // connection opened
    statementProxy.addEventListener('open', function (event) {
        console.log('connect proxy server!');
    });

    // listen for messages
    statementProxy.addEventListener('message', function (event) {
        console.log('received data from proxy server %s', event.data);
        const res = JSON.parse(event.data);

        // add statement
        let codeElement = document.getElementById('code');
        let subCode = document.createElement('pre');
        subCode.innerHTML += res.statement;
        subCode.style.paddingLeft = '59.5px';
        codeElement.appendChild(subCode);
        makeHighlight();

        // add log
        let logElement = document.getElementById('log');
        let timeElement = document.createElement('code');
        timeElement.innerHTML += res.log.time + '    ';
        let operationElement = document.createElement('code');
        operationElement.innerHTML += res.log.operation + '           ';
        operationElement.style.color = '#00FF00';
        let targetElement = document.createElement('code');
        targetElement.innerHTML += res.log.target + '\n';
        targetElement.style.color = '#FFFF00';
        logElement.appendChild(timeElement);
        logElement.appendChild(operationElement);
        logElement.appendChild(targetElement);
    });
}

/**
 * Init operation.
 */
(() => {
    addFormat();
    handleConnection();
})();

/**
 * Make syntax highlight.
 */
function makeHighlight() {
    document.querySelectorAll('pre').forEach((block) => {
        if (block.id === 'code') {
            hljs.highlightBlock(block);
        }
    });
}

/**
 * Bind click event listener.
 */
window.onload = function () {
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
            });
    });

    // download
    const downloadElement = document.getElementById('download');
    downloadElement.addEventListener('click', function (event) {
        window.open('/download');
    });
}