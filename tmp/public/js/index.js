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
});