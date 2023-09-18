/* ImageManager */
/* Manages adding removing and creating images */

import colours from './colours.json';
import { sampleImages } from './fakeNetworkData.js';
let sampleImageCount = 0;
const dict = new Object();
const deathAnimation = {
	animation: "0.5s death ease", 
	animationFillMode: "forwards",
}

/* TODO:
	* When images are added, map the userId to the correct colour, otherwise assign one
	* Discuss the positioning algorithm at some point
	
	ImgPacket template:
	imgPacket = {
		userId:		//ID belong to the clients IP adress
		userName:	//Handle for the IP, [NOT USED FOR IDENTIFICATION]
		imgName:	//Filename of the image
		imgPayload: //ArrayBuffer format
		imgType:	//ImgType eg. PNG JPEG
	}
*/

/* addImage()
	* -------------------------------------------------------
	*  Adds an image to the images array. App.jsx will dynamicaly
	*  render the display manager based on the contents of the images array.
	*  Currently assigns a random colour to the img. --Change this behaviour
	*
	*  imgPacket:
	*		An object with all the information about an image.
	*	setImages():
	*		React hook that updates the images array.
	*/
export function addImage(imgPacket, {images,  setImages }) {
	console.log(imgPacket)

	//Append the colour to the image packet
	if (Object.prototype.hasOwnProperty.call(dict, imgPacket.userId)) {
		Object.assign(imgPacket, { style: dict[imgPacket.userId] })
	} else {
		dict[imgPacket.userId] = colours[Object.keys(dict).length % 5];
		Object.assign(imgPacket, { style: dict[imgPacket.userId] });
	}

	//Update the image state array
	//Current images as an argument so it doesn't overwrite itself
	setImages((currentImages) => {
		return [...currentImages, { id: imgPacket.imgId, data: imgPacket},]
	})
	resizeImages({setImages});
}

export function resizeImages({setImages}) {
	setImages(currentImages => {
		const updatedImages = currentImages;

		//Just ignore this for now I need to find a good palcement algorithm
		for (let i = 0; i < updatedImages.length; i++) {
			const image = updatedImages[i];
			image.data.moving = {
				height: Math.random()*100+"%",
				top: Math.random()*100+"%",
				left: Math.random()*100+"%",
			}
			//image.data.moving = {
			//	height: ((100 / updatedImages.length))+"%",
			//	top: ((i / updatedImages.length)*90)+"%",
			//	left: (( / updatedImages.length)*90)+"%",
			//}
		}
		return updatedImages;
	})

}

/* addTestImage()
	* -------------------------------------------------------
	*  Adds a preselected image from the harddrive to the images array. 
	*  This is used for testing animations and the dynamic layout of the display manager
	*  Usually extivated by [SPACE] key
	*
	*   images:
	*		An array of images that are to be rendered to the screen
	*	setImages():
	*		React hook that updates the images array.
	*/
export function addTestImage({images, setImages }) {

	//Copy image from the sample images
	const image = { ...sampleImages[sampleImageCount++ % sampleImages.length] };

	//Adds an image ID [Warning could pontentially conflict with network imgages]
	image.imgId = sampleImageCount;
	//Add this image
	addImage(image, {images, setImages })
}

export function addUserIcon(userId, { users, setUsers }) {
	console.log("addUser works!")
	setUsers((currentUsers) => [...currentUsers, userId])
}

/* removeUser()
	* -------------------------------------------------------
	*  Removes all images belonging to a certain userId from the display.
	*
	*   userId:
	*		The userId to be removed from the display
	*	setImages():
	*		React hook that updates the images array.
	*/
export function removeUser(userId, { images, setImages }) {
	//Run the death animation
	images.map((image) => {
		if (image.data.userId == userId) {
			removeImage(image.id, { setImages });
		}
	})
}

/* removeImage()
* -------------------------------------------------------
*  Removes an image from the display with the given imgId
*
*   imgId:
*		The id of the image to be removed
*	setImages():
*		React hook that updates the images array.
*/
export function removeImage(imgId, { setImages }) {
	setImages((currentImages) => {
		return currentImages.map((image) => {
			if (image.id == imgId) {
				return applyDeathAnimation(image);
			}
			return image;
		})
	})
	setTimeout(() => {
		setImages((currentImages) => {
			resizeImages({setImages});
			return currentImages.filter((image) => image.id !== imgId)
		})
	}, 500);

}

/* removeUser()
* -------------------------------------------------------
*  Removes all images from the display
*
*	setImages():
*		React hook that updates the images array.
*/
export function removeAllImages({ images, setImages }) {
	images.map(image => {
		removeImage(image.id, {setImages});
	});
}

/* applyDeathAnimation()
* -------------------------------------------------------
*  Applys the death animation to an image (Makes it fly up the screen)
*
*	image:
*		The image theat the death animation should apply to
*/
function applyDeathAnimation(image) {
	let style = Object.assign({}, image.data.style);
	Object.assign(style, deathAnimation)
	image.data.style = style;
	return image;
}


export function getAverageImgSize() {
	const elementList = [...document.getElementsByClassName("imgPod")];
	let boundingList = [];

	elementList.map(image => {
		const imageBounds = image.getBoundingClientRect();
		const area = imageBounds.height * imageBounds.width
		boundingList.push(area);
	})

	//Might need to add average function
	if (boundingList.length === 0) {
		return; // You can choose to return NaN, undefined, or any other value if you prefer
	}
	// Calculate the sum of all elements in the array
	const sum = boundingList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

	// Divide the sum by the number of elements in the array to find the average
	return sum / boundingList.length;
}
