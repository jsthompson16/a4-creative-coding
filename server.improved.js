const express = require("express"),
	path = require("path"),
	http = require("http"),
	app = express(),
	port = (process.env.PORT || 3000),
	bodyParser= require( "body-parser" ),
	helmet = require("helmet"),
	compression = require("compression"),
	mime = require("mime");

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

app.get("/js/main.js", function(req, res) {
	res.sendFile(path.join(__dirname + "/js/main.js"));
});

let server = http.createServer(app);
server.listen(port, function () {
	console.log("server started running");
});
