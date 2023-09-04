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

// Ensure that the paths below match the client vite config "base" option.
app.use('/', express.static(path.join(__dirname, '../client-side/dist')));
app.use('/display', express.static(path.join(__dirname, '../display-manager/dist')));

server.listen(3001, () => {
	console.log("The Node server is running on port 3001")
})
