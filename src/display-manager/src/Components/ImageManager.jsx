/* ImageManager */
/* Manages adding removing and creating images */

import colours from './colours.json';
import { sampleImages } from './fakeNetworkData.js';
let sampleImageCount = 0;
let testUserCount = 0;
const dict = new Object();
const deathAnimation = {
	animation: "0.5s death ease", 
	animationFillMode: "forwards",
}
/* 
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
	// const timeout = 300000 // 5 mins
	const timeout = 10000 // 5 mins
	//Append the colour to the image packet
	if (Object.prototype.hasOwnProperty.call(dict, imgPacket.userId)) {
		Object.assign(imgPacket, { style: dict[imgPacket.userId] })
	} else {
		dict[imgPacket.userId] = colours[Object.keys(dict).length % 5];
		Object.assign(imgPacket, { style: dict[imgPacket.userId] });
	}

	// If there are too many images on the sreen
	if (images.length >= 6) {
		removeImage(images[0].id, {setImages})
		setTimeout(() => {
			setImages((currentImages) => {
				return [...currentImages, { id: imgPacket.imgId, data: imgPacket},]
			})
		}, 1000)
		setTimeout(() => {
			console.log("Image Timed out -- Removing")
			removeImage(imgPacket.imgId, {setImages})
			setTimeout(() => {
				resizeImages({setImages})
			}, 1000)
		}, timeout)
		return
	}

	// console.log(imgPacket.imgId)
	//Update the image state array
	//Current images as an argument so it doesn't overwrite itself
	setImages((currentImages) => {
		return [...currentImages, { id: imgPacket.imgId, data: imgPacket},]
	})

	setTimeout(() => {
		console.log("Image Timed out -- Removing")
		removeImage(imgPacket.imgId, {setImages})
		setTimeout(() => {
			resizeImages({setImages})
		}, 1000)
	}, timeout)

}

export function resizeImages({setImages}) {
	setImages(currentImages => {
		const rootHeight = document.getElementById("imgContainer").getBoundingClientRect().height;
		const rootWidth= document.getElementById("imgContainer").getBoundingClientRect().width;
		const padding = 30;


		let img_row_width = []
		let current_row_width = padding
		for (let i = 0; i < currentImages.length; i++) {
			current_row_width += currentImages[i].data.props.width + padding
			if (current_row_width > rootWidth - padding) {
				current_row_width = rootWidth - padding
			}
			if ((i+1) % 3 == 0) {
				img_row_width.push(current_row_width)
				current_row_width = 0
			}
		}
		img_row_width.push(current_row_width)

		const attributes = {
			left: (rootWidth / 2) - (img_row_width[0] / 2),
			top: 0,
			area: 0,
		};

		for (let i = 0; i < currentImages.length; i++) {
			const image = currentImages[i];

			image.data.moving = {
				height: rootHeight / Math.ceil(currentImages.length / 3) - padding,
				width: Math.min((rootWidth / Math.min(currentImages.length, 3)) - padding, image.data.props.width),
				top: attributes.top,
				left: attributes.left
			}

			image.data.props = image.data.moving;
			attributes.left = ((i+1)%3) ? attributes.left + image.data.props.width + padding : (rootWidth / 2) - (img_row_width[Math.ceil(i / 3)]/2);
			attributes.top = ((i+1)%3) ? attributes.top : attributes.top + image.data.props.height + padding;

		}
		return [...currentImages];
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

/* addTestUser()
* -------------------------------------------------------
*   images:
*		An array of images that are to be rendered to the screen
*	setImages():
*		React hook that updates the images array.
*/
export function addTestUser({users, setUsers}) {
	setUsers((currentUser) => [...currentUser, {
        userId: testUserCount,
        style: dict[testUserCount],
    }
    ])
	testUserCount++;
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
			currentImages.map((image) => {
				image.data.props = image.data.original
				return image
			})
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

/* removeImagesByUser() 
 * Removes all images associated with a specific userId
 */
export function removeImagesByUser(userId, { images, setImages }) {
    // Filter out images that have the matching userId
    const updatedImages = images.filter(image => image.data.userId !== userId);
    setImages(updatedImages);
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


export function calibrateImageSize(images) {
	elementList.map(image => {
		const imageBounds = image.getBoundingClientRect();
		const props = {
			height: imageBounds.height,
			width: imageBounds.width,
			area: imageBounds.width * imageBounds.height
		};
		boundingList.push(props);
		console.log(props)
	})

	for (let i = 0; i < images.length; i++) {
		images[i].data.props = boundingList[i];
	}
	return [...images]
}
