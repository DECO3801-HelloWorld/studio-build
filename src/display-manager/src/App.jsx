/* App.jsx - Display Manager */
/* Entry point of the large interactive display */

/* ETHICAL NOTICE:
* Images are stored in Memory ONLY. They are not uploaded to the server or stored on disk
* AT ANY POINT. This is to protect the user's content from theft by malicious actors.
*
* Pointers to the images in memory are lost 0.5 seconds after the user has requested deletion,
* There is no way to steal content from users without their consent.
*/

/* Security notice:
* No user has access to other users images.
* They can only control the images they themselves send to the server
*/

// Import npm modules
import {useState, useEffect} from 'react'
import io from 'socket.io-client'
import { QRCodeCanvas } from 'qrcode.react'

// These are custom JSX elements
import ImgPod from './Components/ImgPod.jsx'	//Holds images
import UserPod from './Components/UserPod.jsx'	//Holds User Icons
import SplashScreen from './Components/SplashScreen.jsx'		//The screen that displays when no images are present

// Helper modules
import * as ImageManager from './Components/ImageManager.jsx'	//Module for positioning images on screen
import * as NetworkManager from './Components/NetworkManager.jsx' //Module for sending and receiving images on the network

// Style Sheets
import { sideStyle } from './Components/QrStyle.jsx'
import './App.css'


// Connect to the server - ready to receive images
const socket = io.connect(window.location.origin);

// Program constants
const ADD_SAMPLE_IMG_KEY = "Space";
const REMOVE_ALL_IMG_KEY = "Backspace";

/** The start of the display manager react application.
*	This is the entrypoint for the display manager and the top-most parent. */
export default function App() {

	// Setting state - these represent images and users
	const [images, setImages] = useState([]);
	const [users, setUsers] = useState([]);

	// Listen to the server, -- This runs on every render
	useEffect(() => {

		//Start Listening for images
		NetworkManager.listenForImage(socket, { images, setImages });
		NetworkManager.listenForImgRemove(socket, { images, setImages });
		NetworkManager.listenForUserConnect(socket, { users, setUsers });
		NetworkManager.listenForRemoveAllUserImage(socket, {images, setImages});

		// Unmount the listener for the download
		return () => {
			NetworkManager.dismountListeners(socket);
		}
	}, [images, users]); // Run every time these variables change


	// Keybinds for development -- Creates fake images for layout testing
	useEffect(() => {

		// If key pressed
		const handleKeyPress = (event) => {
			switch (event.code) {

				//Set to BACKSPACE
				case REMOVE_ALL_IMG_KEY:
					ImageManager.removeAllImages({ images, setImages });
					break;

				//Set to SPACE
				case ADD_SAMPLE_IMG_KEY:
					//Fake images from hard drive [NOT FROM NETWORK]
					ImageManager.addTestImage({ images, setImages });					
					break;

				case "Digit1":
					//Testing removing specific images
					ImageManager.removeImage(1, { images, setImages })
					break;

				case "Digit2":
					//Testing removing specific images
					ImageManager.removeUser(2, { images, setImages });
					break;

				case "KeyU": //Testing adding users
					ImageManager.addTestUser({users, setUsers});
					break;

				default:
					break;
			}
		}
		document.addEventListener('keydown', handleKeyPress)

		// Unmount Event listener
		return (() => {document.removeEventListener('keydown', handleKeyPress)})
	}, [images]);
	
	// Render application
	return (
		<>
			{/* Only show splash screen if no images*/}
			<SplashScreen 
				style={images.length ? {opacity : 0} : {opacity : 1}}
			/>

			{/* Render however many images we have in the images array */}
			<div id='imgContainer'>
				{images.map(image => {return <ImgPod key={image.id} setImages={setImages} data={image.data}/>})} 
			</div>

			{/* Render Users -- Not Used*/}
			<div className='userContainer'>
				{users.map(user => {return <UserPod style={user.style} key={user.userId}></UserPod>})}
			</div>

			{/* Render QR code */}
			<div className="prompts" style={images.length ? sideStyle : {} }>
				{/* Add something akin to prompt the user to scan the qr code.*/}
				<QRCodeCanvas size="255" id="QR" value={window.location.origin}/>
			</div>
		</>
	)
}
