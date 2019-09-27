const express = require("express"),
    path = require("path"),
    http = require("http"),
    app = express(),
    port = (process.env.PORT || 3000),
    low = require('lowdb'),
    FileSync = require('lowdb/adapters/FileSync'),
    bodyParser= require( 'body-parser' ),
    helmet = require('helmet'),
    compression = require('compression'),
    mime = require("mime");

const adapter = new FileSync('db.json');
const db = low( adapter );
let currentUser = "";

db.defaults({ users: [], orders: [] }).write();

app.use(express.static(path.join(__dirname + "/public")));
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/img/:filename", function(req, res) {
  const filename = req.params["filename"];
  const extensionIndex = filename.lastIndexOf(".");
  const extension = filename.slice(extensionIndex, filename.length);

  res.header("Content-Type", mime.getType(extension));
  res.sendFile(path.join(__dirname + "/src/img/" + filename ));

  console.log("/img/" + filename);
});

app.get("/js/scripts.js", function(req, res) {
  res.sendFile(path.join(__dirname + "/js/scripts.js"));
});

app.post("/submit", function(req, res) {
  let dataString = '';
  req.on( 'data', function( data ) {
    dataString += data
  });

  req.on( 'end', function() {
    const newOrder = JSON.parse(dataString);
    const orderPrice = calcPrice(newOrder.topping1, newOrder.topping2);

    const order = {
      'username': newOrder.username,
      'topping1': newOrder.topping1,
      'topping2': newOrder.topping2,
      'price': orderPrice,
      'id': db.get('orders').size().value() + 1,
      'createdBy': currentUser
    };

    db.get( 'orders' ).push(order).write();

    res.writeHead(200, "OK", {'Content-Type': 'text/plain'});
    res.end();
  })
});

app.post("/update", function(req, res) {
  let dataString = '';
  req.on( 'data', function( data ) {
    dataString += data
  });

  req.on( 'end', function() {
    const updatedOrder = JSON.parse(dataString);
    const newPrice = calcPrice(updatedOrder.topping1, updatedOrder.topping2);
    db.get('orders')
        .find({ id: updatedOrder.id })
        .assign({ username: updatedOrder.username, topping1: updatedOrder.topping1,
                  topping2: updatedOrder.topping2, price: newPrice})
        .write();

    res.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
    res.end();
  })
});

app.post("/delete", function(req, res) {
  let dataString = '';
  req.on( 'data', function( data ) {
    dataString += data
  });

  req.on( 'end', function() {
    const deleteThisOrder = JSON.parse(dataString);

    db.get('orders')
        .remove({ id: deleteThisOrder.id })
        .write();

    res.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
    res.end();
  })
});

let server = http.createServer(app);
server.listen(port, function () {
  console.log("server started running");
});

const calcPrice = function(topping1, topping2) {
  let price = 10;
  if (topping1 !== "")
    price += 2;
  if (topping2 !== "")
    price += 4;
  return price;
};
