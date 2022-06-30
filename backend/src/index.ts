const express = require("express");
const path = require("path");
const http = require("http");

const app = express();
const port = 3000;
const server = http.createServer(app);


const { Server } = require("socket.io");
const io = new Server(server);

app.use("/index.html", express.static(path.join(__dirname, "../../frontend/dist/index.html")));
app.use("/index.js", express.static(path.join(__dirname, "../../frontend/dist/index.js")));
app.use("/index.css", express.static(path.join(__dirname, "../../frontend/dist/index.css")));
app.use("/index.js.map", express.static(path.join(__dirname, "../../frontend/dist/index.js.map")));

app.use("/assets", express.static(path.join(__dirname, "../../frontend/dist/assets")));

// app.get('/', function(req, res) {
// 	res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
//   });


io.on("connection", (socket) => {
	console.log("a user connected");
	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
});

server.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
