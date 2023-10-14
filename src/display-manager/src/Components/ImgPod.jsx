import '../App.css'
import './ImgPod.css'
import { resizeImages } from './ImageManager';
import { useRef , createElement} from 'react'
import base64ArrayBuffer from "./Encoder";
import {FaHorse, FaFish, FaCat, FaDog, FaSpider} from 'react-icons/fa'

function resolve_icon(style) {
	switch (style["--colour1"]) {
		case "#ffe040":
			return 1
		case "#70f0f5":
			return 2
		case "#1aff69":
			return 3
		case "#ff00f7":
			return 4
		case "#f54971":
			return 5

		default:
			return 0;
	}
}

/* The ImgPod(s) are an element that are going to render the user's image in a
* colourful frame. Eventually it'll take arguments from App.jsx about the
* name and associated id/colour of the bubble. 
*/
export default function ImgPod({ data, setImages }) {
	//Encode image into string that can be encoded into the image
	const base64String = base64ArrayBuffer(data.imgPayload)
	const src = (data.imgPath) ? data.imgPath : "data:image/"+data.imgType+";base64,"+base64String

	const icons = {
		1 : FaHorse,
		2 : FaFish,
		3 : FaCat,
		4 : FaDog,
		5 : FaSpider
	}

	const icon = icons[resolve_icon(data.style)]

	const img = useRef(null);

	//Birth animation
	function birthAnimation() {
		Object.assign(img.current.offsetParent.style, {
			animation: "0.5s birth ease 0s",
			animationIterationCount: "1",
			animationFillMode: "forward",
			opacity: "1"
		})

		data.props = {
			width: img.current.width,
			height: img.current.height,
			area: img.current.width * img.current.height,
			ratio: img.current.width / img.current.height //L + ratio
		}
		setTimeout(() => {
			resizeImages({setImages})
		}, 5)
	}

	//This is fucked but lets just ignore it for now
	let style = Object.assign({}, data.style);
	Object.assign(style, data.moving);


	return (
		<div className="imgPod" style={style}>
			<div className='imgPod-icon-container'>
			{createElement(icon, { className: 'imgPod-icon' })}
			</div>
			<img src={src} ref={img} className="img-content" onLoad={birthAnimation} alt={data.imgName}/>
		</div>
	)
}
