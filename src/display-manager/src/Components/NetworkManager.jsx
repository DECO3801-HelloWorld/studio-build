/* Network Manager */
/* Takes care of networking, 
	* Responsibilities involve:
	* Getting images, 
	* managing websockets
	* Dismounting listeners when finished */

//Import ImageManager to perform actions based on websockets
import * as ImageManager from './ImageManager.jsx'

/**
 * Creates an event listener for the image download event on the socket and adds an image if one is received.
 *
 * @param {Socket} socket - The socket to listen to.
 * @param {{ images: Array, setImage: function }} imageState - The state of images on the display. */
export function listenForImage(socket, imageState) {
	// if there is an image from the server
	socket.on("download_img", (imgPacket) => {

		// print out image info and add to image state
		console.log(`Image received form ${imgPacket.userName} : ${imgPacket.imgName}`);
		imgPacket.userId = imgPacket.userId || null;
		ImageManager.addImage(imgPacket, imageState);
	});
}

/**
 * Creates an event listener for the "display_remove_all_image" event on the socket and removes all images associated with a specific user.
 *
 * @param {Socket} socket - The socket to listen to.
 * @param {{ images: Array, setImages: function }} imageState - The state of images on the display.
 */
export function listenForRemoveAllUserImage(socket, {images, setImages}) {
	socket.on("display_remove_all_image", ({ userId }) => {
		// print out image info and add to image state
		console.log(`Removing image with ID: ${userId}`);
		ImageManager.removeUser(userId, {images, setImages});
	})
	socket.on("remove_user", ({ userId }) => {
		console.log(`Removing all images belonging to user: ${userId}`);
		ImageManager.removeUser(userId, imageState);
	})
}

/**
 * UNUSED: This function is intended for handling user connection events but is currently unused.
 *
 * Creates an event listener for the "user_connect" event on the socket. When a user connects, it attempts to add the user's icon to the display.
 *
 * @param {Socket} socket - The socket to listen to.
 * @param {UserState} userState - The state of user-related information on the display.
 */
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

/**
 * Listens to the "remove_img" event from the socket and calls for the ImageManager to remove the image.
 *
 * @param {Socket} socket - The socket to listen to.
 * @param {{ images: Array, setImage: function }} imageState - The state of images on the display.
 */
export function listenForImgRemove(socket, imageState) {

	// if there is an image from the server
	socket.on("remove_img", ({ imgId }) => {
		// print out image info and add to image state
		console.log(`Removing image with ID: ${imgId}`);
		ImageManager.removeImage(imgId, imageState);
	})
}

/**
 * Calls `socket.off()` to remove all the appropriate event listeners. This function is required for the `useEffect` hook to function properly.
 *
 * @param {Socket} socket - The socket to remove event listeners from.
 */
export function dismountListeners(socket) {
	socket.off("download_img");
	socket.off("remove_user");
	socket.off("user_connect");
	socket.off("connect_error");
	socket.off("remove_img");
	socket.off("display_remove_all_image");
}

