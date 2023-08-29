import { useState } from 'react'
import './App.css'
import ImgPod from './Components/ImgPod.jsx'
import connect_to_server from './Components/ServerConnect.jsx'

//Just for testing, eventually will create a websocket to the node server
connect_to_server()

/* Just as a note: Images need to be imported so that React can use
*  Absolute paths during complile
*/
export default function App() {
	return (
		<>
		{/* Five zebra's because why not */}
		<ImgPod/>
		<ImgPod/>
		<ImgPod/>
		<ImgPod/>
		</>
	)
}
