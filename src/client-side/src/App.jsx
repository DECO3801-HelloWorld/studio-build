import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import * as NetworkManager from "./Components/NetworkManager.jsx";
import "./App.css";

//Server variables
const socket = io.connect(window.location.origin); //Socket is connection to server
var count = 0;

//Testing Variables
const userId = 1; //Maybe grab this from server in future
const userName = "Test User"; //Device name maybe?
//const Hammer = require('hammerjs')//Require Hammer.js

export default function App() {
  const [imageURL, setImageURL] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  //Grab Upload button
  const fileUploadButton = useRef(null);


  useEffect(() => {
    // Setting up listeners for socket connection and disconnection
    socket.on('connect', () => {
        setIsConnected(true);
    });

    socket.on('disconnect', () => {
        setIsConnected(false);
    });

    // Listen for server updates about images
    socket.on('updateImages', (updatedImages) => {
        setImageURL(updatedImages);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('updateImages');
  }
}, []);

  /* uploadFile()
   *  ------------------------
   *  Uploads the file from the input element with id "imgUpload" to the server
   *  Requires:
   *		userId, UserName and socket global variables are initialised
   */
  function uploadFile(e) {
    const file = NetworkManager.getFile(fileUploadButton);
    const imgPacket = NetworkManager.packImage(file, userId, userName, imageURL.length);
    NetworkManager.sendImage(socket, imgPacket);

    const newImageURLs = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const imgFile = e.target.files[i];
      const reader = new FileReader();

      reader.onloadend = () => {
        newImageURLs.push(reader.result);
        setImageURL((currentImageUrl) => {
          return [
            ...currentImageUrl,
            {
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

    //this adds the list of images to imageURL
  }

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
              <span className="upload-text">Upload your Image</span>
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
  function imgMapFxn() {
    return imageURL.map((image) => (
          <div
            className="upload-image"
            onTouchMove={(e) => {
              const screenHeight = Dimensions.get("window").height;
              console.log(screenHeight);
              const touchY = e.nativeEvent.pageY;
              console.log(touchY);

              // Get the position of the top and bottom of the image
              const imageTop = touchY;
              const imageBottom =
                touchY + PixelRatio.getPixelSizeForLayoutSize(363); // Height of the image

              if (imageTop >= 20 || imageBottom >= screenHeight - 20) {
                // Image touches the top or bottom of the screen (within 20 pixels)
                alert("Image touches the top or bottom of the screen");
              }
            }}
          >
            <img src={image.URLs} alt="Oops!" />
          </div>
    ));
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
      {/* {console.log("initial value "+socket.connected)} */}
      {/*Upload button*/}
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
          class="disconnect-button"
          htmlFor="Disconnect"
          onClick={() => {
			  NetworkManager.disconnectUser(socket)
            setImageURL([]);
          }}
        >
          Remove My Images
        </button>
        {/* {<label onClick={print}>printing</label>} */}
      </div>
    </>
  );
}
