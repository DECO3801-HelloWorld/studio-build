import { useState } from "react";
import logo from '../images/squirrel.jpg'
import '../App.css'
import './ImgPod.css'

/* The ImgPod(s) are an element that are going to render the user's image in a
* colourful frame. Eventually it'll take arguments from App.jsx about the
* name and associated id/colour of the bubble. 
*
* */
export default function ImgPod() {
	return (
		<div className="imgPod">
			<p className="user-name"> Benjamin Jorgensen </p>
			<div className="img-content" src={logo} alt="whoops"/>
		</div>
	)
}
