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
		ImageManager.addImage(imgPacket, imageState);
	})
}
