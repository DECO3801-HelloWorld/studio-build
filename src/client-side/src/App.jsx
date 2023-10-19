import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import * as NetworkManager from "./Components/NetworkManager.jsx";
import "./App.css";
import { v4 as uuidv4 } from 'uuid';


//Server variables
const socket = io.connect(window.location.origin); //Socket is connection to server
var count = 0;

//Testing Variables
const userId = uuidv4(); //Maybe grab this from server in future
const userName = uuidv4(); //Device name maybe?

//const Hammer = require('hammerjs')//Require Hammer.js

export default function App() {
  const [imageURL, setImageURL] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  //Grab Upload button
  const fileUploadButton = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMovingDown, setIsMovingDown] = useState(false);


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
    const imgId = uuidv4();
    const imgPacket = NetworkManager.packImage(file, userId, userName, imgId);
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
              id: imgPacket.imgId,
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
  const TOUCH_THRESHOLD = 200; // Define a threshold to trigger the alerts

  // Event handlers for dragging images
  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    const initialTouch = {
      startX: touch.clientX,
      startY: touch.clientY,
    };

    // Store the initial touch position in the state
    setPosition((prevPosition) => ({
      ...prevPosition,
      initialTouch,
    }));
  };

  const handleTouchMove = (event) => {
    setIsMovingDown(true);
    if (position.initialTouch) {
      const touch = event.touches[0];
      const deltaX = touch.clientX - position.initialTouch.startX;
      const deltaY = touch.clientY - position.initialTouch.startY;

      // Update the position state to move the image
      setPosition((prevPosition) => ({
        ...prevPosition,
        x: deltaX,
        y: deltaY,
      }));

      // Check if the image moves beyond the threshold before displaying alerts
      if (Math.abs(deltaY) >= TOUCH_THRESHOLD) {
        // const screenHeight = Dimensions.get('window').height;
        
        if (position.y >= TOUCH_THRESHOLD) {
          // Image touches the bottom of the screen (within the threshold)
          setImageURL((prevImageURL) => prevImageURL.slice(0, prevImageURL.length - 1));
          //NetworkManager.packImage(file, userId, userName, imgId);
         
          const imgPacket = NetworkManager.packImage(imageURL[imageURL.length - 1].imgFile, userId,userName , imageURL[imageURL.length - 1].id);
          console.log(imgPacket);
          NetworkManager.swipeRemove(socket,imgPacket);
          handleTouchEnd ();
          //alert("hii");
        }
       
      }
    }
  };

  const handleTouchEnd = () => {
    // Animate the image back to its original position
    // using CSS transitions
    
      setIsMovingDown(false);
    
    setPosition((prevPosition) => ({
      ...prevPosition,
      x: 0,
      y: 0,
      initialTouch: null,
    }));
  
  };

  function imgMapFxn() {
    return  imageURL.map((image,index) => (
      <>
    {isMovingDown && (
      <div className="gradient-overlay">
        <p>Swipe down to remove</p>
      </div>
    )}
        <div className="upload-image"
        style={{
          marginTop: `${(15 * index)}px`, // Adjust the vertical spacing between images
          marginLeft: `${(15 * index)}px`,
          transform: `translate(${position.x}px, ${position.y}px) scale(1)`,
          }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
          >
            <img  src={image.URLs} alt="Oops!" />
          {/* <img src={imageURL[imageURL.length - 1].URLs} alt="Oops!" /> */}
        </div>
        </>
    )
    );
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
	  htmlFor="image-upload"
	  onClick={() => fileUploadButton.current.click()}
	  style={imageURL.length === 0 ? {opacity : 0} : {}} className="extra-upload">
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
