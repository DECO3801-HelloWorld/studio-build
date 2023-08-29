import { useState } from "react";
import '../App.css'
import './ImgPod.css'

/* The ImgPod(s) are an element that are going to render the user's image in a
* colourful frame. Eventually it'll take arguments from App.jsx about the
* name and associated id/colour of the bubble. 
*/
export default function ImgPod({ data }) {
	const podStyle = {
		backgroundImage: `url('${data.img}')`,
	}
	return (
		<div className="imgPod" style={data.style}>
			<p className="user-name" style={data.style}> {data.name} </p>
			<div className="img-content" style={podStyle} alt="whoops"/>
		</div>
	)
}
