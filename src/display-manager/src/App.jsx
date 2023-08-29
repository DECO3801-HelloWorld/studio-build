import { useState } from 'react'
import './App.css'
import  ImgPod  from './Components/ImgPod.jsx'

/* Just as a note: Images need to be imported so that React can use
*  Absolute paths during complile
*/
export default function App() {
	return (
		<>
		<h1>hello_world</h1>
		<ImgPod/>
		</>
	)
}
