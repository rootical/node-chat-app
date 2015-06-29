var ws = new WebSocket("ws://localhost:3000");

ws.onopen = function (event) {
    document.getElementById('ChatSend').querySelector('button').onclick = function () {
          ws.send(document.getElementById('ChatInput').querySelector('input').value);
    }
};

ws.onmessage = function (event) {
  console.log('Incoming from serv: %s', event.data);

    var element = document.createElement('li');
    element.innerHTML = event.data;
    document.getElementById('ChatMessages').querySelector('ul').appendChild(element);
}



