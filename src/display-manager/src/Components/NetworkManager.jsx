/* Network Manager */
/* Takes care of networking, including websockets and the actions related to them */
import * as ImageManager from './ImageManager.jsx'


/* listenForImage()
	* -------------------------------------------------------
	*  Creates an event listener for the image download event on the socket.
	*  Adds an image if one is received
	*
	*  socket:
	*		The socket to listen to
	*	imageState:
	*		{images, setImage} the state of images on the display
	*/
export function listenForImage(socket, imageState) {
	// if there is an image from the server
	socket.on("download_img", (imgPacket) => {
		// print out image info and add to image state
		console.log(`Image received form ${imgPacket.userName} : ${imgPacket.imgName}`);
		imgPacket.userId = imgPacket.userId || null;
		ImageManager.addImage(imgPacket, imageState);
	});

	socket.on('updateImages', (updatedImages) => {
        imageState.setImages(updatedImages);
    });
}

export function listenForRemoveAllImage(socket, {images, setImages}) {
	socket.on("display_remove_all_image", ({ userId }) => {
		// print out image info and add to image state
		console.log(`Removing image with ID: ${userId}`);
		ImageManager.removeUser(userId, {images, setImages});
	})
}

//Stub for user data
export function listenForUserConnect(socket, userState) {
	socket.on("user_connect"), () => {
		const userId = 0;
		try {
			console.log("connected user")
			console.log(userId)
			ImageManager.addUserIcon(userId.useId, userState);
		} catch (error) {
			console.log(error);
			console.log("Failed in listenForUserConnect()");

		}
	}
}

/* listenForImgRemove()
	* -------------------------------------------------------
	*  Listens to the remove image event from the socket and
	*  calls for the ImageManager to remove the image
	*
	*  socket:
	*		The socket to listen to
	*	imageState:
	*		{images, setImage} the state of images on the display
	*/
export function listenForImgRemove(socket, imageState) {

	// if there is an image from the server
	socket.on("remove_img", ({ imgId }) => {
		// print out image info and add to image state
		console.log(`Removing image with ID: ${imgId}`);
		ImageManager.removeImage(imgId, imageState);
	})
}

/* listenForRemoveUser()
	* -------------------------------------------------------
	*  Listens to the remove user event from the socket and
	*  calls for the ImageManager to remove all images from 
	*  the user
	*
	*  socket:
	*		The socket to listen to
	*	imageState:
	*		{images, setImage} the state of images on the display
	*/
export function listenForRemoveUser(socket, imageState, userState) {
	socket.on("remove_user", ({ userId }) => {
		console.log(`Removing all images belonging to user: ${userId}`);
		ImageManager.removeUser(userId, imageState);
	})
}

// export function removeImagesByUser(userId, { images, setImages }) {
// 	const updatedImages = images.filter(image => image.userId !== userId);
// 	setImages(updatedImages);
// }

/* dismountListeners()
	* -------------------------------------------------------
	*  Will call socket.off() on all the appropriate event listeners.
	*  Required for the useEffect hook to function
	*
	*  socket:
	*		The socket to listen to
	*	imageState:
	*		{images, setImage} the state of images on the display
	*/
export function dismountListeners(socket) {
	socket.off("download_img");
	socket.off("remove_user");
	socket.off("user_connect");
	socket.off("connect_error");
	socket.off("remove_img");
	socket.off("display_remove_all_image");
}

export function disconnectUser(socket, imageState) {
	// socket.on("disconnectUser", ({ userId }) => {
	// 	console.log(`Removing all images belonging to user: ${userId}`);
	// 	ImageManager.removeImagesByUser(userId, imageState)
	// })

	socket.emit('remove_all_image', userId);
}