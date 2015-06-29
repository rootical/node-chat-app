var ws = new WebSocket("ws://localhost:3000");

ws.onopen = function (event) {
  ws.send("Here's some text that the server is urgently awaiting!");
};

ws.onmessage = function (event) {
  console.log(event.data);
}

