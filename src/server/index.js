import express from 'express';
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import path from 'path';
import { fileURLToPath } from 'url';

//PORT NUM
const port = process.env.PORT || 3001;

// Create new server
const app = express();
app.use(cors());
const server = http.createServer(app)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Format setting for server
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
	// Max file payload 100MB
	maxHttpBufferSize: 1e8,
})

// When connected log the socketID
io.on("connection", (socket) => {
	console.log(`User connected: ${socket.handshake.address}`)

	// If we receive an image, send it to the display
	socket.on("upload_img", (imgPacket) => {
		console.log(`Sending Image ${imgPacket.imgName} from ${imgPacket.userName}`)
		socket.broadcast.emit("download_img", imgPacket);
	})

	// Declare Disconnects
	socket.on("disconnect", () => {
		console.log("client disconnected");
	})

	socket.on("request_img_remove", (imgPacket) => {
		console.log("Requested to remove an image.");
		console.log(imgPacket);
	})
})

// Ensure that the paths below match the client vite config "base" option.
// Serve the client upload interface.
app.use('/', express.static(path.join(__dirname, '../client-side/dist')));
// Serve the display code.
app.use('/display', express.static(path.join(__dirname, '../display-manager/dist')));

server.listen(port, () => {
	console.log("Server Started on port " + port)
})


// === For Debugging only ===
/*
let id = 0;
const testConnectUser = () => {
	io.emit("user_connect", {userId: id});
	id;
}
setInterval(testConnectUser, 5_000);
const testRemoveUser = () => {
	io.emit("remove_user", {userId: id});
	id++;
}
setInterval(testRemoveUser, 5_100);
*/
// ==========================
