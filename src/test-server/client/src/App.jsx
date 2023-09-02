import { useRef } from 'react';
import io from 'socket.io-client'
import './App.css'

//Connect to server
const socket = io.connect("http://localhost:3001");

function App() {
	//Grab Upload button
	const fileUploadButton = useRef(null)

	/* upload() 
	* 
	* Sends the first files held in the input element to the webserver
	* Gets packaged into imgPacket with all neccisry metadata
	*/
	function upload() {
		const files = fileUploadButton.current.files;
		if (!files) {
			console.log("No files")
			return 
		}
		const file = files[0];

		//Object to the sent to the server
		const imgPacket = {
			userId: 1,				//ID belong to the clients IP adress
			userName: "Benjamin",	//Handle for the IP, [NOT USED FOR IDENTIFICATION]
			imgID: 1,				//Unique ID for the image being uploaded
			imgName: file.name,		//Filename of the image
			imgPayload: file,		//Base64 format
			imgType: file.type,		//ImgType eg. PNG JPEG
		}

		//Upload image to server
		socket.emit("upload_img", imgPacket, (status) => {
			console.log(status)
		})
	}

	return (
		<>
		{/*Upload button*/}
		<label htmlFor="imgUpload"> Upload Image here </label>
		<input type="file" ref={fileUploadButton} onChange={upload} id="imgUpload"/>
		</>
	)
}

export default App
