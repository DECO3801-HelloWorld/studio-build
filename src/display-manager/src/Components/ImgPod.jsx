import { useState } from "react";
import '../App.css'
import './ImgPod.css'
import {useRef, useEffect} from 'react'
import base64ArrayBuffer from "./Encoder";

/* The ImgPod(s) are an element that are going to render the user's image in a
* colourful frame. Eventually it'll take arguments from App.jsx about the
* name and associated id/colour of the bubble. 
*/
export default function ImgPod({ data }) {
	//Encode image into string that can be encoded into the image
	const base64String = base64ArrayBuffer(data.imgPayload)
	const src = (data.imgPath) ? data.imgPath : "data:image/"+data.imgType+";base64,"+base64String


	return (
		<div className="imgPod" style={data.style}>
			<p className="user-name" style={data.style}> {data.userName} </p>
			<img src={src} className="img-content" alt="whoops"/>
		</div>
	)
}
