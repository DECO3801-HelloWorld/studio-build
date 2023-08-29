import { useState } from 'react'
import ImgPod from './Components/ImgPod.jsx'
import colours from './Components/colours.json'

//Importing all images - We will get these by web socket in future
import cat from './images/cat.jpg'
import zebra from './images/zebra.jpg'
import bird from './images/bird.jpg'
import nut from './images/squirrel.jpg'

import connect_to_server from './Components/ServerConnect.jsx' //Not implemented

//Application styling - ( ImgPod styling found at ./Components/ImgPod.css)
import './App.css'


//Just for testing, eventually will create a websocket to the node server
connect_to_server()

/* Simulating user data received from websocket */
const userData1 = {
	userId: 1,
	style: colours.red,
	name: "Benjamin",
	img: zebra,
}

const userData2 = {
	userId: 2,
	style: colours.blue,
	name: "Kristian",
	img: cat,
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

/* This is where the application is rendered
*/
export default function App() {
	return (
		<>
		<ImgPod data={userData1}/>
		<ImgPod data={userData2}/>
		<ImgPod data={userData3}/>
		<ImgPod data={userData4}/>
		</>
	)
}
