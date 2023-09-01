import {useState, useEffect} from 'react'
import ImgPod from './Components/ImgPod.jsx'
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

/* This is where the application is rendered
*/
export default function App() {
	const [images, setImages] = useState([]);
	const [count, setCount] = useState(0);

	function addImage(userData) {
		setImages((currentImages) => {
			return [
				...currentImages,
				{id: uuidv4(), data: userData },
			]
		})
	}

	useEffect(() => {
		const handleKeyPress = (event) => {
			if (event.code == "Space") {
				event.preventDefault();
				addImage(imgPodsTemplate[count % 4]);
				setCount(count + 1);
			}
		}
		document.addEventListener('keypress', handleKeyPress)
		return (() => {document.removeEventListener('keypress', handleKeyPress)})
	});

	return (
		<>
		{images.length == 0 && <h1>Press [SPACE] to add image</h1>}
		{images.map(vibe => { return <ImgPod key={vibe.id} data={vibe.data}/>})}
		</>
	)
}
