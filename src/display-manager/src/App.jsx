import React, {useState, useEffect} from 'react'
import ImgPod from './Components/ImgPod.jsx'
import colours from './Components/colours.json'

//Importing all images - We will get these by web socket in future
import cat from './images/cat.jpg'
import zebra from './images/zebra.jpg'
import bird from './images/bird.jpg'
import nut from './images/squirrel.jpg'
import { v4 as uuidv4 } from 'uuid';

import connect_to_server from './Components/ServerConnect.jsx' //Not implemented

//Application styling - ( ImgPod styling found at ./Components/ImgPod.css)
import './App.css'

/* Simulating user data received from websocket */
const userData1 = {
	userId: 1,
	style: colours.red,
	name: "Benjamin",
	img: cat,
}

const userData2 = {
	userId: 2,
	style: colours.blue,
	name: "Kristian",
	img: zebra,
}

const userData3 = {
	userId: 3,
	style: colours.green,
	name: "Tad",
	img: bird,
}

const userData4 = {
	userId: 4,
	style: colours.purple,
	name: "Benjamin Again",
	img: nut,
}

//Just for testing, eventually will create a websocket to the node server
connect_to_server()


/* This is where the application is rendered
*/
export default function App() {
	const [ElmImgPod, setElmImgPod] = useState([]);
	const [count, setCount] = useState(0);
	const users = [userData1, userData2, userData3, userData4];

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.code == "Space") {
				create_element(users[count % 4]);
			}
		}
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		}
	})


	function create_element(user_data) {
		setCount(count + 1);
		setElmImgPod((currentImgPods) => {
			return [
				...currentImgPods,
				{id: uuidv4(), data: user_data },
			]
		})
	}

	return (
		<>
		<h1>Press [SPACE] to add image</h1>
		{ElmImgPod.map(vibe => {
			return (
				<ImgPod key={vibe.id} data={vibe.data}/>
			)
		})}
		</>
	)
}
