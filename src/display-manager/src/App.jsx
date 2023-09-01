import {useState, useEffect} from 'react'
import ImgPod from './Components/ImgPod.jsx'
import SplashScreen from './Components/SplashScreen.jsx'
import colours from './Components/colours.json'

//Importing all images - We will get these by web socket in future
import cat from './images/cat.jpg'
import zebra from './images/zebra.jpg'
import bird from './images/bird.jpg'
import nut from './images/squirrel.jpg'
import { v4 as uuidv4 } from 'uuid';

import connectToServer from './Components/ServerConnect.jsx' //Not implemented

//Application styling - ( ImgPod styling found at ./Components/ImgPod.css)
import './App.css'

/* Simulating user data received from websocket */
const imgPodData1 = {
	userId: 1,
	style: colours.red,
	name: "Benjamin",
	img: cat,
}

const imgPodData2 = {
	userId: 2,
	style: colours.blue,
	name: "Kristian",
	img: zebra,
}

const imgPodData3 = {
	userId: 3,
	style: colours.green,
	name: "Tad",
	img: bird,
}

const imgPodData4 = {
	userId: 4,
	style: colours.purple,
	name: "Benjamin Again",
	img: nut,
}
const imgPodsTemplate = [imgPodData1, imgPodData2, imgPodData3, imgPodData4];

//Just for testing, eventually will create a websocket to the node server
connectToServer()

/* This is where the application is rendered */
export default function App() {
	//Controlling the state - If you need to change these variables
	//Do so with the setX functions
	const [images, setImages] = useState([]);
	const [count, setCount] = useState(0);

	/* Will add images to the webpage - call with user data as seen above */
	function addImage(userData) {
		setImages((currentImages) => {
			return [
				...currentImages,
				{id: uuidv4(), data: userData },
			]
		})
	}

	/* Restart and clean slate */
	function removeAllImages() {
		setImages(() => {return []})
	}

	/* Binds [Space] and [Backspace] to add and remove images respectivly */
	useEffect(() => {
		const handleKeyPress = (event) => {
			if (event.code == "Space") {
				event.preventDefault(); //Stop normal space activity
				addImage(imgPodsTemplate[count % 4]); //Add an image (this will be from websocket in future)
				setCount(count + 1); //Remember how many images there are
			}
			if (event.code == "Backspace") {
				event.preventDefault();
				removeAllImages();
				setCount(0);
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
