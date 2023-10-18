import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import * as NetworkManager from "./Components/NetworkManager.jsx";
import "./App.css";

/**
 * Connects to the current server location using socket.io.
 */
const socket = io.connect(window.location.origin);

//Variables for demo purposes
var count = 0;
const userId = 1;
const userName = "Test User";

export default function App() {
  const [imageURL, setImageURL] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const fileUploadButton = useRef(null);

 /*
  * Sets the connection state when the socket connects or disconnects.
  * Also listens for server updates about images.
  */
  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('updateImages', (updatedImages) => setImageURL(updatedImages));

    // Cleanup listeners on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('updateImages');
  }
}, []);

  /*
   *  Uploads the file from the input element with id "imgUpload" to the server
   *  @param {Event} e - The event triggered by file input change.
   */
  function uploadFile(e) {
    const file = NetworkManager.getFile(fileUploadButton);
    const imgPacket = NetworkManager.packImage(file, userId, userName, imageURL.length);
    NetworkManager.sendImage(socket, imgPacket);

    const newImageURLs = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const imgFile = e.target.files[i];
      // const files = NetworkManager.getFiles(fileUploadButton);
      // files.forEach((file, index) => {
      // const imgPacket = NetworkManager.packImage(file, userId, userName, imageURL.length + index);
      // NetworkManager.sendImage(socket, imgPacket);

      console.log("Sending image", file);

      const reader = new FileReader();
      reader.onloadend = () => {
        newImageURLs.push(reader.result);
        setImageURL((currentImageUrl) => {
          return [
            ...currentImageUrl,
            {
              //id: count++,
              id: count++,
              name: imgPacket.imgName,
              imgFile: file,
              URLs: newImageURLs[i],
            },
          ];
        });
      };
      reader.readAsDataURL(imgFile);
    }
  }

  /**
   * Renders the upload button and information.
   */
  function uploadFxn() {
    return (
      <div className="upload-box">
        <label className="file-uploader-container">
          <div className="centered-content">
            <img src="src\Components\Upload icon.png" />
          </div>
          <div>
            <button
              className="upload-button"
              htmlFor="image-upload"
              onClick={() => fileUploadButton.current.click()}
            >
              <span className="upload-text">
                Upload your Image
              </span>
            </button>
          </div>
          <div className="supported-formats-text">
            <br></br>
            Supported formats: JPEG, PNG, TIFF, GIF
          </div>
        </label>
      </div>
    );
  }

  /**
   * Maps and renders each uploaded image.
   */
  function imgMapFxn() {
	  return (
		  <div className="upload-image">
			<img src={imageURL[imageURL.length -1].URLs} alt="Oops!" />
		  </div>)
  }

  /* Entry Point of Program
   * ---------------------------------------------
   *  This where the page is rendered.
   *  Write jsx in the return function of this program.
   *  If you're unfamiliar with jsx, it's like HTML except that expressions in
   *  {} curly braces are evaluated as javascript.
   */
  return (
    <>
      <div className="wrapper-upload-btn">
        <div className="header">
          <div className="header-text">MagicShare</div>
        </div>
        {/* {status()} */}
        {imageURL.length === 0 ? uploadFxn() : imgMapFxn()}
        <div className="start-presenting-button">
          <input
            type="file"
            ref={fileUploadButton}
            onChange={uploadFile}
            id="image-upload"
            accept="image/*" // Specify accepted file types
          />
        </div>
        <button 
	        htmlFor="image-upload"
	        onClick={() => fileUploadButton.current.click()}
	        style={imageURL.length === 0 ? {opacity : 0} : {}} 
          className="extra-upload"
        >
	        Upload More Images
        </button>
			  <button
          className="disconnect-button"
          htmlFor="Disconnect"
          onClick={() => {
			      NetworkManager.disconnectUser(socket)
            setImageURL([]);
          }}
        >
          Remove My Images
        </button>
      </div>
    </>
  );
}
