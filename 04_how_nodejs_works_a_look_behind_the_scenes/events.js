const EventEmitter = require("events");
const http = require("http");

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

// const myEmitter = new EventEmitter();
const myEmitter = new Sales();

myEmitter.on("newSale", () => {
  console.log("There was a new sale!");
});

myEmitter.on("newSale", () => {
  console.log("Customer name: Jonas");
});

myEmitter.on("newSale", (stock) => {
  console.log("total stock left: " + stock);
});

// myEmitter.emit("newSale", 9);

//----------------------------------------------//

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("request received");
  res.end("request received");
});

server.on("request", (req, res) => {
  console.log("another Request");
  //   res.end("another Request");
});

server.on("close", () => {
  console.log("server close");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("waiting for request");
});
