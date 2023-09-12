import express from 'express';
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'

//Create new server
const app = express();
app.use(cors());
const server = http.createServer(app)

//Format setting for server
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
	//Max file payload 100MB
	maxHttpBufferSize: 1e8,
})

//When connected log the socketID
io.on("connection", (socket) => {
	console.log(`User connected: ${socket.id}`)

	//If we receive an image, send it to the display
	socket.on("upload_img", (imgPacket) => {
		console.log(`Sending Image ${imgPacket.imgName} from ${imgPacket.userName}`)
		socket.broadcast.emit("download_img", imgPacket);
	})

	//Decalre Disconnects
	socket.on("disconnect", () => {
		console.log("client disconnected");
	})
})


server.listen(5173, () => {
	console.log("Server Started on port 3001")
})
