import {useState, useEffect} from 'react'
import io from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid';

import colours from './Components/colours.json'
import ImgPod from './Components/ImgPod.jsx'
import SplashScreen from './Components/SplashScreen.jsx'

//Application styling - ( ImgPod styling found at ./Components/ImgPod.css)
import './App.css'

const socket = io.connect("http://localhost:3001");

/* This is where the application is rendered */
export default function App() {
	//Controlling the state - If you need to change these variables
	//Do so with the setX functions
	const [images, setImages] = useState([]);

	//If an image is pushed onto the client
	useEffect(() => {
		socket.on("download_img", (imgPacket) => {
			//Check for command in future
			console.log("image received")
			addImage(imgPacket);
		})
		return () => {
			socket.off("download_img");
		}
	}, []);

	/* Will add images to the webpage - call with user data as seen above */
	function addImage(imgPacket) {
		Object.assign(imgPacket, {style: colours[Math.floor(Math.random() * 5)]}) //TODO: Map this properly
		setImages((currentImages) => {
			return [ ...currentImages, {id: uuidv4(), data: imgPacket}, ]
		})
	}

	/* Restart and clean slate */
	function removeAllImages() {
		setImages(() => {return []})
	}

	/* Remove all images from a user with the ID given -- called when user disconnect */
	function removeUser(userId) {
		setImages((currentImages) => {
			return currentImages.filter((image) => image.data.userId !== userId)
		})
	}

	/* Binds [Backspace] to remove images on screen*/
	useEffect(() => {
		const handleKeyPress = (event) => {
			switch (event.code) {
				case "Backspace":
					removeAllImages();
					setCount(0);
					break;
				default:
					break;
			}
		}
		document.addEventListener('keydown', handleKeyPress)
		return (() => {document.removeEventListener('keydown', handleKeyPress)})
	});

	return (
		<>
		{/* Only show splash screen if no images*/}
		<SplashScreen style={images.length ? {opacity : 0} : {opacity : 1}}/>
		{/* Render however many images we have in the images array */}
		{images.map(image => { return <ImgPod key={image.id} data={image.data}/>})}
		</>
	)
}
