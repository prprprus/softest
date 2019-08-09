// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:8080');

// Connection opened
socket.addEventListener('open', function (event) {
    console.log('connect server!');
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('received data from wss %s', event.data);
    // dom
    // let pNode1 = document.createElement('p');
    // let code1 = `let e = await page.$x(${event.data});`
    // let textNode1 = document.createTextNode(code1);
    // pNode1.appendChild(textNode1);
    // document.getElementById('code').appendChild(pNode1);

    // let pNode2 = document.createElement('p');
    // let code2 = "await e[0].click();"
    // let textNode2 = document.createTextNode(code2);
    // pNode2.appendChild(textNode2);
    // document.getElementById('code').appendChild(pNode2);

    // let code1 = `let e = await page.$x(${event.data});`
    // let code2 = '\n';
    // let code3 = "await e[0].click();"
    // let code4 = '\n\n';
    let elm = document.getElementById('code');
    elm.innerHTML += event.data;

    let elmd = document.getElementById('log');
    elmd.innerHTML += event.data;

    document.querySelectorAll('pre').forEach((block) => {
        console.log('========================================>', block);
        hljs.highlightBlock(block);
    });
});

// bind click event listener
window.onload = function () {
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
        // const elements = document.getElementsByTagName('body');
        // elements[0].style.cursor = 'crosshair';
    });

    const endElement = document.getElementById('end');
    endElement.addEventListener('click', function (event) {
        fetch('http://localhost:3000/end')
            .then(function (res) {
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