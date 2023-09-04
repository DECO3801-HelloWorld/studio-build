import express from 'express';
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import path from 'path';
import { fileURLToPath } from 'url';

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
	console.log(`User connected: ${socket.id}`)

	// If we receive an image, send it to the display
	socket.on("upload_img", (imgPacket) => {
		console.log(`Sending Image ${imgPacket.imgName} from ${imgPacket.userName}`)
		socket.broadcast.emit("download_img", imgPacket);
	})

	// Declare Disconnects
	socket.on("disconnect", () => {
		console.log("client disconnected");
	})
})

app.use('/display', express.static(path.join(__dirname, '../client/dist')));
// TODO: Add static endpoint for the client page.

server.listen(3001, () => {
	console.log("Server Started on port 3001")
})
