/* Network Manager
* --------------------------------------
* This module is designed to obscure most of the networking functions of the client
* You can call basic functions related to sending data without interfacing with the
* socket.io API
*/

/* packImage() 
* --------------------------------------
	* Takes relevent information about the image being uploaded and 
	* packs it into an imgPacket object.
	* 
	* file - object:
	*		The file data to be sent. Can be obtained by getFile()
	* userId - int:
	*		The ID of the user that belongs to this client instance
	* userName - string:
	*		The display name of the user that belongs to the device
	*
	* Returns:
	*		imgPacket - The packed object that contains all information
	*					about an image.
*/
export function packImage(file, userID, userName) {
	const imgPacket = {
		userId: userID,			//ID belong to the clients IP adress
		userName: userName,		//Handle for the IP, [NOT USED FOR IDENTIFICATION]
		imgName: file.name,		//Filename of the image
		imgPayload: file,		//ArrayBuffer format
		imgType: file.type,		//ImgType eg. PNG JPEG
	}
	return imgPacket;
}

/* sendImage() 
* --------------------------------------
	* Send's image packets to the server connected to the socket
	* 
	* socket - object:
	*		Connection to the server
	* imgPacket - object:
	*		The object obtained from packImage().
*/
export function sendImage(socket, imgPacket) {
	socket.emit("upload_img", imgPacket, (status) => {
		console.log(status);
	})
	console.log(`Image ${imgPacket.imgName} send by ${imgPacket.userName}` )
}

/* getFile() 
* --------------------------------------
	* Obtains the file object from the upload button on the DOM
	* 
	* fileUploadButton - DOM.element
	*		The reference to the input button in which the file is held
	*
	* Returns:
	*		The file that has been selected
*/
export function getFile(fileUploadButton) {
	const files = fileUploadButton.current.files;
	if (!files) {
		console.log("No files selected")
		return;
	}
	return files[0];
}

/* disconnectUser() 
* --------------------------------------
	* Disconnects the user from the socket, severing connection with server
	* 
	* socket - object
	*		The socket connected with the server
*/
export function disconnectUser(socket) {
	socket.disconnect()
	console.log(`Client initiated disconnect from server` )
}

