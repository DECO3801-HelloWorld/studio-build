/* App.jsx - Display Manager */

// Import npm modules
import {useState, useEffect} from 'react'
import io from 'socket.io-client'
import { QRCodeSVG } from 'qrcode.react'

// Importing Custom modules
import ImgPod from './Components/ImgPod.jsx' //Images are rendered
import UserPod from './Components/UserPod.jsx' //Images are rendered
import SplashScreen from './Components/SplashScreen.jsx' //Title screen is rendered
import * as ImageManager from './Components/ImageManager.jsx' //Image loading functionality
import * as NetworkManager from './Components/NetworkManager.jsx'
import { sideStyle } from './Components/QrStyle.jsx'
import './App.css'

//Dumb
//const port = (typeof process !== 'undefined') ? (process.env.PORT || 3001) : 3001;

// Connect to the server - ready to receive images
const socket = io.connect(window.location.origin);

// Program constants
const ADD_SAMPLE_IMG_KEY = "Space";
const REMOVE_ALL_IMG_KEY = "Backspace";

/* App()
* The start of the display manager react application.
* This is the entrypoint for the display manager and the top-most parent. */
export default function App() {

	/*Controlling the state - If you need to change these variables
	 * Do so with the setX functions */
	const [images, setImages] = useState([]);
	const [users, setUsers] = useState([]);

	// Server-Listening  -  Run on every render update
	useEffect(() => {
		//Start Listening for images
		NetworkManager.listenForImage(socket, { images, setImages });
		NetworkManager.listenForImgRemove(socket, { images, setImages });
		NetworkManager.listenForUserConnect(socket, { users, setUsers });
		NetworkManager.listenForRemoveUser(socket, { images, setImages }, { users, setUsers });
		NetworkManager.listenForRemoveAllImage(socket, {images, setImages});
		NetworkManager.disconnectUser(socket, userId);
		//ImageManager.resizeImages({setImages})

		//Not sure who wrote this but it broke display manager
		// socket.on('updateImages', (updatedImages) => {
		// 	setImages(updatedImages);
		//   });

		// Unmount the listener for the download
		return () => {
			NetworkManager.dismountListeners(socket);
			// socket.off('updateImages');
			//ImageManager.resizeImages({setImages})
		}
	}, [images, users]);


	// Bind keys for easy layout testing
	useEffect(() => {
		// If key pressed
		const handleKeyPress = (event) => {
			switch (event.code) {
				case REMOVE_ALL_IMG_KEY:
					ImageManager.removeAllImages({ images, setImages });
					break;
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
				{images.map(image => {return <ImgPod key={image.id} setImages={setImages} data={image.data}/>})} </div>
			<div className='userContainer'>
				{users.map(user => {return <UserPod style={user.style} key={user.userId}></UserPod>})}
			</div>
			<div className="prompts"
				style={images.length ? sideStyle : {} }>
				{/* Add something akin to prompt the user to scan the qr code.*/}
				<QRCodeSVG id="QR" value={window.location.origin}/>
			</div>
		</>
	)
}
