import { useState } from "react";
import logo from '../images/zebra.jpg'
import '../App.css'

/* The ImgPod's are an element that are going to render the user's image in a
	* colourful frame. Eventually it'll take arguments from App.jsx about the
	* name and associated id/colour of the bubble. 
*
* */
export default function ImgPod() {
	return (
			<img src={logo} alt="whoops"/>
	)
}
