/* index.js */
/* Backend server program responsible for processing network requests from client to display */
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

/*ETHICAL NOTE:
	* For user privacy, there are no image being stored in this program. They are processed and then immediately sent to the display.
	* Images are not stored on disk EVER to ensure that content sent from the clients are always confidential
	* Users only have control over their own images and can not download/modify other user images

/* SECURITY NOTE:
	* Users must be validated via the network before they are permitted to use the server, ensuring 
	* a secure environment for the system to operate
*/

//PORT NUMBER as defined in the environment variable
const port = process.env.PORT || 3001;

/**
 * Converts an IPv4 address in string format to an integer.
 *
 * This function takes an IPv4 address in string format (e.g., '192.168.1.1') and
 * converts it to a 32-bit unsigned integer. It uses bitwise shifting and parsing
 * to perform the conversion.
 *
 * @param {string} ip - The IPv4 address in string format to be converted.
 * @returns {number} The 32-bit unsigned integer representing the IPv4 address.
 *
 * @see https://gist.github.com/jppommet/5708697
 */
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
		imgPacket.userId = ip2int(socket.handshake.address)
		imgPacket.imgId = ip2int(socket.handshake.address)+imgPacket.imgId
		socket.broadcast.emit("remove_img", imgPacket)
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
