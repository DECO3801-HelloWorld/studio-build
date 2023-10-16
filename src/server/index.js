import express from 'express';
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import path from 'path';
import { fileURLToPath } from 'url';
import {
	handle_lost_connection,
	handle_new_connection
} from './event-handlers/network_monitor.js';

//PORT NUM
const port = process.env.PORT || 3001;

function ip2int(ip) {
    return ip.split('.').reduce(function(ipInt, octet) { return (ipInt<<8) + parseInt(octet, 10)}, 0) >>> 0;
}

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

let images = []

// When connected log the socketID
io.on("connection", (socket) => {
	console.log(`User connected: ${socket.handshake.address}`)

	// If we receive an image, send it to the display
	socket.on("upload_img", (imgPacket) => {
		console.log(`Sending Image ${imgPacket.imgName} from ${imgPacket.userName}`)
		imgPacket.userId = ip2int(socket.handshake.address)
		imgPacket.imgId = ip2int(socket.handshake.address)+imgPacket.imgId
		socket.broadcast.emit("download_img", imgPacket);
	})

	socket.on("disconnectUser", (userId) => {
		// Remove images uploaded by the disconnected user
		images = images.filter(image => image.userId !== userId);
	  
		// Notify all clients about the updated images array
		io.emit('updateImages', images);
	  });

	// Declare Disconnects
	socket.on("disconnect", () => {
		console.log(`client disconnected - ${socket.handshake.address}`);
	})

	socket.on("remove_all_image", () => {
		const payload = { userId: ip2int(socket.handshake.address)}
		socket.broadcast.emit("display_remove_all_image", payload)
		console.log(`User ${payload.userId} requested a remove all images`)
	})

	socket.on("request_img_remove", (imgPacket) => {
		console.log("Requested to remove an image.");
		console.log(imgPacket);
	})

	socket.on("new_connection", handle_new_connection(socket));
	socket.on("lost_connection", handle_lost_connection(socket));
})

// Ensure that the paths below match the client vite config "base" option.
// Serve the client upload interface.
app.use('/', express.static(path.join(__dirname, '../client-side/dist')));
// Serve the display code.
app.use('/display', express.static(path.join(__dirname, '../display-manager/dist')));

server.listen(port, "0.0.0.0", () => {
	console.log("Opening port " + port + " for traffic")
})
