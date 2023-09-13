import '../App.css'
import './ImgPod.css'
import {useRef, useEffect} from 'react'
import base64ArrayBuffer from "./Encoder";

/* The UserPod(s) are an element that are going to render a small icon for each
*  user
*/
export default function UserPod() {
	return (
		<div className="userPod" style={data.style} height="5%" width="5%" 
			position="absolute" right="0px" top="0px">
		</div>
	)
}
