// ================================================

// Create WebSocket connection.
const statementProxy = new WebSocket('ws://localhost:8080');

// Connection opened
statementProxy.addEventListener('open', function (event) {
    console.log('connect statement proxy server!');
});

// Listen for messages
statementProxy.addEventListener('message', function (event) {
    console.log('received data from statement proxy server %s', event.data);

    // code
    let codeElement = document.getElementById('code');
    let subCode = document.createElement('pre');
    subCode.innerHTML += event.data;
    subCode.style.paddingLeft = '59.5px';
    codeElement.appendChild(subCode);

    // log
    let logElement = document.getElementById('log');
    logElement.innerHTML += event.data;

    // highlight
    document.querySelectorAll('pre').forEach((block) => {
        hljs.highlightBlock(block);
    });
});

// ================================================

// const screenshotProxy = new WebSocket('ws://localhost:8081');

// screenshotProxy.addEventListener('open', function (event) {
//     console.log('connect screenshot proxy server');
// });

// ================================================

// bind click event listener
window.onload = function () {
    const element = document.getElementById('record');
    element.addEventListener('click', function (event) {
        // clean
        const codeElement = document.getElementById('code');
        codeElement.innerHTML = '';
        // init code
        let subCode = document.createElement('pre');
        subCode.innerHTML += `
const puppeteer = require('puppeteer');

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
        subCode.style.paddingLeft = '35px';
        codeElement.appendChild(subCode);
        document.querySelectorAll('pre').forEach((block) => {
            hljs.highlightBlock(block);
        });
        fetch('http://localhost:3000/record')
            .then(function (res) {
                console.log('record: ', res.status);
            });
    });

    // screenshot
    const screenshotElement = document.getElementById('screenshot');
    screenshotElement.addEventListener('click', function (event) {
        fetch('http://localhost:3000/screenshot')
            .then(function (res) {
                console.log('screenshot: ', res.status);
            });
    });

    // full
    const fullElement = document.getElementById('full');
    fullElement.addEventListener('click', function (event) {
        const codeElement = document.getElementById('code');
        let subCode = document.createElement('pre');
        const now = Date.now();
        subCode.innerHTML += `
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
await page.waitFor(3000);
await page.screenshot({
  path: '/Users/tiger/develop/tmp/script/${now}.png',
  type: 'png',
  fullPage: true
});
await page.waitFor(500);

`;
        subCode.style.paddingLeft = '59.5px';
        codeElement.appendChild(subCode);
        document.querySelectorAll('pre').forEach((block) => {
            hljs.highlightBlock(block);
        });
        fetch('http://localhost:3000/full')
            .then(function (res) {
                console.log('full: ', res.status);
            });
    });

    // end
    const endElement = document.getElementById('end');
    endElement.addEventListener('click', function (event) {
        const codeElement = document.getElementById('code');
        let subCode = document.createElement('pre');
        subCode.innerHTML += `
  await page.waitFor(3000);
  await browser.close()
})();
`;
        subCode.style.paddingLeft = '43px';
        codeElement.appendChild(subCode);
        document.querySelectorAll('pre').forEach((block) => {
            hljs.highlightBlock(block);
        });

        const data = {
            code: codeElement.textContent,
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
    });

    // play
    const playElement = document.getElementById('play');
    playElement.addEventListener('click', function (event) {
        fetch('http://localhost:3000/play')
            .then(function (res) {
                console.log('play: ', res.status);
            });
    });

    // report
    const reportElement = document.getElementById('report');
    reportElement.addEventListener('click', function (event) {
        fetch('http://localhost:3000/report')
            .then(function (res) {
                console.log('report: ', res.status);
            });
    });

    // download
    const downloadElement = document.getElementById('download');
    downloadElement.addEventListener('click', function (event) {
        fetch('http://localhost:3000/download')
            .then(function (res) {
                console.log('download: ', res.status);
            });
    });
}