/* ImageManager */
/* Manages Image position in the screen
*  Places, removes and otherwise modifies size and attributes of the
* users images */

/* ETHICAL NOTICE:
* Images are stored in Memory ONLY. They are not uploaded to the server or stored on disk
* AT ANY POINT. This is to protect the user's content from theft by malicous actors.
*
* Pointers to the images in memory are lost 0.5 seconds after the user has requested deletion,
* There is no way to steal content from users without their consent.
*/

/* Security notice:
* No user has access to other users images.
* They can only control the images they themselves send to the server
*/

// Impor Colours for ImgPod Borders
import colours from './colours.json';
import { sampleImages } from './fakeNetworkData.js';

//Variables for keeping track of sample images
let sampleImageCount = 0;
let testUserCount = 0;
const colourMatch = new Object();

//CSS for making images go offscreen when they've been removed
const deathAnimation = {
	animation: "0.5s death ease", 
	animationFillMode: "forwards",
}

/**
 * Adds an image to the `images` array. App.jsx will dynamically render the display manager based on the contents of the `images` array.
 * 
 * The function also assigns a color to the image based on the `userId`. The list of colours can be found in file colour.json
 *
 * @param {object} imgPacket - An object with all the information about an image.
 * @param {Function} setImages - React hook that updates the `images` array.
 */
export function addImage(imgPacket, {images,  setImages }) {

	//Append the colour to the image packet
	if (Object.prototype.hasOwnProperty.call(colourMatch, imgPacket.userId)) {
		Object.assign(imgPacket, { style: colourMatch[imgPacket.userId] })
	} else {
		colourMatch[imgPacket.userId] = colours[Object.keys(colourMatch).length % 5];
		Object.assign(imgPacket, { style: colourMatch[imgPacket.userId] });
	}

	// Remove images if there are too many on screen
	if (images.length >= 6) {
		removeImage(images[0].id, {setImages})
		//Wait for animation to play
		setTimeout(() => {
			setImages((currentImages) => {
				return [...currentImages, { id: imgPacket.imgId, data: imgPacket},]
			})
		}, 1000)
		return
	}

	//Add image to react image state
	setImages((currentImages) => {
		return [...currentImages, { id: imgPacket.imgId, data: imgPacket},]
	})
}

/**
 * Resizes images within the `imgContainer`. This function calculates and updates the positioning and dimensions of the images
 * based on the current layout of the images within the container. Call this function whenever
 * you have changed the state of `images`
 *
 * @param {Function} setImages - React hook that updates the `currentImages` array.
 */
export function resizeImages({setImages}) {
	setImages(currentImages => {
		//Container dimentions
		const rootHeight = document.getElementById("imgContainer").getBoundingClientRect().height;
		const rootWidth= document.getElementById("imgContainer").getBoundingClientRect().width;
		const padding = 30; //Padding between ImgPods

		//Create an array of all the widths of the images in each row
		let imgRowWidth = preprocessWidths(padding, currentImages, rootWidth)

		//If there was an error Just bail and dont resize
		if (imgRowWidth === null) {
			console.log("couln't resolve images")
			return [...currentImages]
		}

		//Calculate the position of the first image
		const imgPosition = {
			left: (rootWidth / 2) - (imgRowWidth[0] / 2), //Place in center of screen
			top: 0,
			area: 0,
		};

		//For each image, calculate it's position
		for (let i = 0; i < currentImages.length; i++) {
			const image = currentImages[i];

			//Modify the images, position using it's moving attribute
			image.data.moving = {
				height: rootHeight / Math.ceil(currentImages.length / 3) - padding,
				width: Math.min((rootWidth / Math.min(currentImages.length, 3)) - padding, image.data.props.width),
				top: imgPosition.top,
				left: imgPosition.left
			}

			//Set it's actuall position to it's calculated one
			image.data.props = image.data.moving;

			//Work out which row it belongs on
			imgPosition.left = ((i+1)%3) ? imgPosition.left + image.data.props.width + padding : (rootWidth / 2) - (imgRowWidth[Math.ceil(i / 3)]/2);
			imgPosition.top = ((i+1)%3) ? imgPosition.top : imgPosition.top + image.data.props.height + padding;

		}
		return [...currentImages];
	})
}


/**
 * Preprocesses and calculates the widths of image rows within the container.
 *
 * @param {number} padding - The padding value to be used in the calculations.
 * @param {Array} currentImages - An array of images to be processed.
 * @param {number} rootWidth - The width of the root container.
 * @returns {Array|null} An array of calculated image row widths or null if there is an issue.
 */
function preprocessWidths(padding, currentImages, rootWidth) {
	let imgRowWidth = []
	let currentRowWidth = padding

	for (let i = 0; i < currentImages.length; i++) {

		//If image hasn't loaded yet return null
		if (!currentImages[i].data.props) {
			return null
		}

		//Append the width of image to running total
		currentRowWidth += currentImages[i].data.props.width + padding
		if (currentRowWidth > rootWidth - padding) {
			currentRowWidth = rootWidth - padding
		}

		//If there's already three images on a row, create a new one
		if ((i+1) % 3 == 0) {
			imgRowWidth.push(currentRowWidth)
			currentRowWidth = 0
		}
	}
	//Add the row to the array
	imgRowWidth.push(currentRowWidth)
	return imgRowWidth
}


/**
 * Adds a preselected image from the hard drive to the `images` array. This function is typically used for testing animations and the dynamic layout of the display manager. It is usually activated by the [SPACE] key.
 *
 * @param {Array} images - An array of images that are to be rendered on the screen.
 * @param {Function} setImages - React hook that updates the `images` array.
 */
export function addTestImage({images, setImages }) {

	//Copy image from the sample images
	const image = { ...sampleImages[sampleImageCount++ % sampleImages.length] };

	//Adds an image ID [Warning could pontentially conflict with network imgages]
	image.imgId = sampleImageCount;
	//Add this image
	addImage(image, {images, setImages })
}

/**
 * Adds a test user to the list of users. This function is typically used for testing purposes.
 *
 * @param {Function} setUsers - React hook that updates the list of users.
 */
export function addTestUser({ setUsers }) {
	setUsers((currentUser) => [...currentUser, {
        userId: testUserCount,
        style: colourMatch[testUserCount],
    }
    ])
	testUserCount++;
}



/**
 * Adds an icon for a user with the given `userId`. Note that this feature is not currently implemented and is a placeholder for future development.
 *
 * @param {number} userId - The unique identifier of the user.
 * @param {Function} setUsers - React hook that updates the list of users.
 */
export function addUserIcon(userId, { setUsers }) {
	console.log("addUser works!")
	setUsers((currentUsers) => [...currentUsers, userId])
}

/**
 * This function is intended to remove all images belonging to a certain `userId` from the display.
 *
 * @param {number} userId - The `userId` to be removed from the display.
 * @param {Function} setImages - React hook that updates the `images` array.
 */
export function removeUser(userId, { images, setImages }) {
	//Run the death animation
	images.map((image) => {
		if (image.data.userId == userId) {
			removeImage(image.id, { setImages });
		}
	})
}

/**
 * Removes an image from the display with the given `imgId`. This function updates the `images` array and applies a death animation to the removed image.
 *
 * @param {number} imgId - The ID of the image to be removed.
 * @param {Function} setImages - React hook that updates the `images` array.
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

	//Set the image size to it's original so that it can be resized again
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

/**
 * Removes all images from the display.
 *
 * @param {Array} images - An array of images to be removed.
 * @param {Function} setImages - React hook that updates the `images` array.
 */
export function removeAllImages({ images, setImages }) {
	images.map(image => {
		removeImage(image.id, {setImages});
	});
}

/**
 * Applies the death animation to an image, making it fly up the screen.
 *
 * @param {object} image - The image to which the death animation should be applied.
 * @returns {object} The modified image with the death animation applied.
 */
function applyDeathAnimation(image) {
	let style = Object.assign({}, image.data.style);
	Object.assign(style, deathAnimation)
	image.data.style = style;
	return image;
}

/**
 * Takes a JSON object of styles and returns an ID based on the style.
 *
 * @param {object} style - The style object to resolve into an ID.
 * @returns {number} An ID based on the style. Returns 0 if the style is not recognized.
 */
export function resolveIcon(style) {
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
