import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import * as NetworkManager from './Components/NetworkManager.jsx'
import './App.css'

//Server variables
const serverPort = "5173"									//Might change in future
const socket = io.connect("http://localhost:"+serverPort);  //Socket is connection to server

//Testing Variables
const userId = 1;				//Maybe grab this from server in future
const userName = "Test User"	//Device name maybe?


export default function App() {
	const [imageURL,setImageURL]=useState([])
	//Grab Upload button
	const fileUploadButton = useRef(null)

	/* uploadFile()
	*  ------------------------
	*  Uploads the file from the input element with id "imgUpload" to the server
	*  Requires:
	*		userId, UserName and socket global variables are initialised
	*/
	function uploadFile(e) {
		const file = NetworkManager.getFile(fileUploadButton);
		const imgPacket = NetworkManager.packImage(file, userId, userName);
		NetworkManager.sendImage(socket, imgPacket);

		const newImageURLs=[];
		for(let i=0;i<e.target.files.length;i++){
				const imgFile = e.target.files[i];
				const reader = new FileReader();

				reader.onloadend = () =>{
					newImageURLs.push(reader.result);
					setImageURL((currentImageUrl) =>{
						return [
							...currentImageUrl ,
							{
								id:crypto.randomUUID(),
								name :imgPacket.imgName,
								imgFile:file,
								URLs:newImageURLs[i]
						},
					]
			})
		}
			reader.readAsDataURL(imgFile)
	}
		
		//this adds the list of images to imageURL
		
	}

	
	
	
	function print(){
		{imageURL.map(imageURL =>{
			console.log(imageURL.name)
		})}
	}

		
	// Call when the client would like to disconnect
	{/*NetworkManager.disconnectUser(socket);*/}


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
		
		<form>
		
		{/*data:image/"+data.imgType+";base64,"+base64String */}
		
		
		</form>
		<label htmlFor="imgUpload" > Upload Image here </label>
		<input type="file" ref={fileUploadButton} onChange={uploadFile}  id="imgUpload"/> 
		{imageURL.map(imageURL =>{
			return( 
			<label htmlFor='image'  key={imageURL.id} >
				<img src ={imageURL.URLs} alt ="Woops"/>
			</label>
			);
		})}
		<label 
		htmlFor='Disconnect'
		onClick={() => NetworkManager.disconnectUser(socket)}>
		
			Disconnect</label>
		<label onClick={print}>printing</label>
		</>
	)
}

