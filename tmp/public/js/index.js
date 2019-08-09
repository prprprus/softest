// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:8080');

// Connection opened
socket.addEventListener('open', function (event) {
    console.log('connect server!');
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('received data from wss %s', event.data);

    // code
    let codeElement = document.getElementById('code');
    let subCode = document.createElement('pre');
    subCode.innerHTML += event.data;
    subCode.style.paddingLeft = '67.5px';
    codeElement.appendChild(subCode);

    // log
    let logElement = document.getElementById('log');
    logElement.innerHTML += event.data;

    // highlight
    document.querySelectorAll('pre').forEach((block) => {
        hljs.highlightBlock(block);
    });
});

// bind click event listener
window.onload = function () {
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
            \`--window - size = 1265, 1400 \`,
        ],
    })
    let pages = await browser.pages();
    await pages[0].close();

    let page = await browser.newPage();
    await page.setViewport({
        width: 1265,
        height: 1400
    });

    let element = null;
`;
    subCode.style.paddingLeft = '35px';
    codeElement.appendChild(subCode);

    // highlight
    document.querySelectorAll('pre').forEach((block) => {
        hljs.highlightBlock(block);
    });

    const element = document.getElementById('record');
    element.addEventListener('click', function (event) {
        fetch('http://localhost:3000/record')
            .then(function (res) {
                console.log('record: ', res.status);
            });
    });

    const screenshotElement = document.getElementById('screenshot');
    screenshotElement.addEventListener('click', function (event) {
        fetch('http://localhost:3000/screenshot')
            .then(function (res) {
                console.log('screenshot: ', res.status);
            });
    });

    const endElement = document.getElementById('end');
    endElement.addEventListener('click', function (event) {
        const codeElement = document.getElementById('code');
        codeElement.innerHTML += `
        await page.waitFor(3000);
        await browser.close()
    })();
`;
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

    const playElement = document.getElementById('play');
    playElement.addEventListener('click', function (event) {
        fetch('http://localhost:3000/play')
            .then(function (res) {
                console.log('play: ', res.status);
            });
    });

    const reportElement = document.getElementById('report');
    reportElement.addEventListener('click', function (event) {
        fetch('http://localhost:3000/report')
            .then(function (res) {
                console.log('report: ', res.status);
            });
    });

    const downloadElement = document.getElementById('download');
    downloadElement.addEventListener('click', function (event) {
        fetch('http://localhost:3000/download')
            .then(function (res) {
                console.log('download: ', res.status);
            });
    });
}