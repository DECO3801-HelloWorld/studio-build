/* ImgPod */
/* Component that holds images send from the client */

//Import styling
import '../App.css'
import './ImgPod.css'

// Get the appropriate functions from image manager 
import { resizeImages, resolveIcon} from './ImageManager';
import { useRef , createElement} from 'react'
import base64ArrayBuffer from "./Encoder";
import {FaHorse, FaFish, FaCat, FaDog, FaSpider} from 'react-icons/fa'


/**
 * The `ImgPod` component is responsible for rendering a user's image in a colorful frame. It can receive data from App.jsx, including the user's name and associated id/color for the bubble.
 *
 * @param {object} data - Data containing information about the user's image and associated properties.
 * @param {Function} setImages - React hook for updating the images state.
 */
export default function ImgPod({ data, setImages }) {

	//Encode image into string that can be encoded into the image
	const base64String = base64ArrayBuffer(data.imgPayload)
	//Resolve source based on type of image
	const src = (data.imgPath) ? data.imgPath : "data:image/"+data.imgType+";base64,"+base64String

	//Map of icons and their ID
	const icons = {
		1 : FaHorse,
		2 : FaFish,
		3 : FaCat,
		4 : FaDog,
		5 : FaSpider
	}

	//Get the icon based on ID
	const icon = icons[resolveIcon(data.style)]
	const img = useRef(null);

	/**
	 * Animates the birth of an image and updates its properties.
	 *
	 * This function applies a birth animation to an image, which includes setting
	 * animation properties and updating the image's width, height, area, and ratio.
	 * It also stores the original image properties. Finally, it resizes the image
	 * to ensure correct positioning.
	 *
	 * @function
	 * @name birthAnimation
	 * @returns {void}
	 */
	function birthAnimation() {
		//Apply birth animation
		Object.assign(img.current.offsetParent.style, {
			animation: "0.5s birth ease 0.3s",
			animationIterationCount: "1",
			animationFillMode: "forward",
			opacity: "1"
		})

		//set image width, length as props
		data.props = {
			width: img.current.width,
			height: img.current.height,
			area: img.current.width * img.current.height,
			ratio: img.current.width / img.current.height //L + ratio
		}

		//store original  image width, length as props
		data.original = {
			width: img.current.width,
			height: img.current.height,
			area: img.current.width * img.current.height,
			ratio: img.current.width / img.current.height //L + ratio
		}

		//Reize images so that they are positioned correctly
		resizeImages({setImages})
		setTimeout(() => {
			resizeImages({setImages})
		}, 500)
	}

	//Creating the style variable - eg colourful frame
	let style = Object.assign({}, data.style);
	Object.assign(style, data.moving);


	return (
		<div className="imgPod" style={style}>
			<div className='imgPod-icon-container'>
			{/* Create the icon */}
			{createElement(icon, { className: 'imgPod-icon' })}
			</div>
			<img src={src} ref={img} className="img-content" onLoad={birthAnimation} alt={data.imgName}/>
		</div>
	)
}
