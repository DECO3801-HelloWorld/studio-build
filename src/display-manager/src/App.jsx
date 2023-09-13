/* App.jsx - Display Manager */

// Import npm modules
import {useState, useEffect} from 'react'
import io from 'socket.io-client'

// Importing Custom modules
import ImgPod from './Components/ImgPod.jsx' //Images are rendered
import SplashScreen from './Components/SplashScreen.jsx' //Title screen is rendered
import * as ImageManager from './Components/ImageManager.jsx' //Image loading functionality
import * as NetworkManager from './Components/NetworkManager.jsx'
import './App.css'

// Connect to the server - ready to receive images
const socket = io.connect("http://localhost:3001");

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
	const imageState = {images, setImages};
	const [users, setUsers] = useState([]);
	const userState = {users, setUsers};

	// Server-Listening  -  Run on every render update
	useEffect(() => {
		//Start Listening for images
		NetworkManager.listenForImage(socket, imageState);
		NetworkManager.listenForImgRemove(socket, imageState);

		// Unmount the listener for the download
		return () => {
			NetworkManager.dismountListeners(socket);
		}
	}, [socket]);

	// Bind keys for easy layout testing
	useEffect(() => {
		// If key pressed
		const handleKeyPress = (event) => {
			switch (event.code) {
				case REMOVE_ALL_IMG_KEY:
					ImageManager.removeAllImages(imageState);
					break;
				case ADD_SAMPLE_IMG_KEY:
					//Fake images from hard drive [NOT FROM NETWORK]
					ImageManager.addTestImage(imageState);					break;
				case "Digit1":
					//Testing removing specific images
					ImageManager.removeImage(1, imageState)
					break;
				case "Digit2":
					//Testing removing specific images
					ImageManager.removeUser(2, imageState);
					break;
				default:
					break;
			}
		}
		document.addEventListener('keydown', handleKeyPress)

		// Unmount Event listener
		return (() => {document.removeEventListener('keydown', handleKeyPress)})
	});

	// Render application
	return (
		<>
		{/* Only show splash screen if no images*/}
		<SplashScreen style={images.length ? {opacity : 0} : {opacity : 1}}/>
		{/* Render however many images we have in the images array */}
		{images.map(image => {return <ImgPod key={image.id} data={image.data}/>})}
		{users.map(user => {return <UserPod key={user.userId}></UserPod>})}
		</>
	)
}
