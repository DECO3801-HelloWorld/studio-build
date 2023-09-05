import { useRef } from 'react'
import io from 'socket.io-client'
import * as NetworkManager from './Components/NetworkManager.jsx'
import './App.css'

//Server variables
const serverPort = "3001"									//Might change in future
const socket = io.connect("http://localhost:"+serverPort);  //Socket is connection to server

//Testing Variables
const userId = 1;				//Maybe grab this from server in future
const userName = "Test User"	//Device name maybe?


export default function App() {

	//Grab Upload button
	const fileUploadButton = useRef(null)

	/* uploadFile()
	*  ------------------------
	*  Uploads the file from the input element with id "imgUpload" to the server
	*  Requires:
	*		userId, UserName and socket global variables are initialised
	*/
	function uploadFile() {
		const file = NetworkManager.getFile(fileUploadButton);
		const imgPacket = NetworkManager.packImage(file, userId, userName);
		NetworkManager.sendImage(socket, imgPacket);
	}
		
	// Call when the client would like to disconnect
	//NetworkManager.disconnectUser(socket);


	/* Entry Point of Program
	* ---------------------------------------------
	*  This where the page is rendered.
	*  Write jsx in the return function of this program.
	*  If you're unfamiliar with jsx, it's like HTML except that expressions in
	*  {} curly braces are evaluated as javascript.
	*/
	return (
		<>
		{/*Upload button*/}
		<label htmlFor="imgUpload"> Upload Image here </label>
		<input type="file" ref={fileUploadButton} onChange={uploadFile} id="imgUpload"/> 
		</>
	)
}

