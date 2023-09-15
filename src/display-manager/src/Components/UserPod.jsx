import '../App.css'
import './UserPod.css'
import {useRef, useEffect} from 'react'

/* The UserPod(s) are an element that are going to render a small icon for each
*  user
*/
export default function UserPod({ data }) {
	return (
		<div className="userPod" style={data.style} top="5px" right="5px">
		userPod
		</div>
	)
}
