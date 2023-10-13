import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import * as NetworkManager from "./Components/NetworkManager.jsx";
import "./App.css";
import {
  Animated,
  View,
  StyleSheet,
  PanResponder,
  Text,
  PixelRatio,
  Dimensions,
} from "react-native-web";
import { useSpring, animated } from 'react-spring';


//import Hammer from "hammerjs";
//Server variables
const port =
  typeof process !== "undefined"
    ? typeof process !== "undefined"
      ? process.env.PORT || 3001
      : 3001
    : 3001;
const socket = io.connect(window.location.origin); //Socket is connection to server
console.log("initial value " + socket.connected);
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
  const pan = useRef(new Animated.ValueXY()).current;
  const [position, setPosition] = useState({ x: 0, y: 0 });

  
  const panResponder = useRef(
   
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        console.log('PanResponderMove:', gestureState);
        Animated.event([null, { dx: pan.x, dy: pan.y }])(event, gestureState);
        const imageTop = gestureState.moveY;
        const screenHeight = Dimensions.get("window").height;
            const imageBottom =
            gestureState.moveY + PixelRatio.getPixelSizeForLayoutSize(363); // Height of the image

            if (imageTop <= 20 || imageBottom >= screenHeight - 20) {
              // Image touches the top or bottom of the screen (within 20 pixels)
              console.log("yoooooooooo")
              // alert("Image touches the top or bottom of the screen");
            }

      },
      onPanResponderRelease: (event, gestureState) => {
        console.log('PanResponderRelease:', gestureState);
        //alert("going back ");
         // Animate the view back to its original position
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false, // Set this to true if using native driver
      }).start();

      // Reset the position in the state
      setPosition({ x: 0, y: 0 });

        //pan.flattenOffset();
      },

    })
  ).current;


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
  //extra function
  function print() {
    {
      imageURL.map((imageURL) => {
        // console.log(imageURL.name);
      });
      console.log(socket.Connected);
    }
  }

  // function handleSwipe(event) {
  //   const { direction } = event;

  //   if (direction == Hammer.DIRECTION_UP) {
  //     console.log("Swipe-up");
  //     alert('Swipe up detected');
  //   } else if (direction == Hammer.DIRECTION_DOWN) {
  //     console.log("Swipe-down");
  //     alert('Swipe down detected');
  //   }
  // }
  function status() {
    return isConnected == true ? (
      <div className="text"> Connected to Server </div>
    ) : (
      <div className="text"> Not Connected to Server </div>
    );
  }

  function uploadFxn() {
    return (
      //   <div>
      //   <img
      //     className="test-image"
      //     src="https://via.placeholder.com/200"
      //     alt="Test Image"
      //   />
      // </div>

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
    

    console.log(socket.connected);
    return imageURL.map((image) => (
      
      <View style = {{width: PixelRatio.getPixelSizeForLayoutSize(800), // Convert 800px to dp
      height: PixelRatio.getPixelSizeForLayoutSize(363), }} key={image.id}>
        <Animated.View
          key={image.id}
        style={{
          
          transform: [{translateX: pan.x}, {translateY: pan.y}],
        }}
          {...panResponder.panHandlers}
        ><div className="upload-image">
          <img  src={image.URLs} alt="Oops!" />
        
          </div></Animated.View>
        </View >

      
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
          <button
            htmlFor="image-upload"
            onClick={() => fileUploadButton.current.click()}
          >
            Start Presenting
          </button>
          <input
            type="file"
            ref={fileUploadButton}
            onChange={uploadFile}
            id="image-upload"
            accept="image/*" // Specify accepted file types
            // capture // Capture from device camera if available
          />
        </div>
        <div>
        <button
          class="disconnect-button"
          htmlFor="Disconnect"
          onClick={() => {
			  NetworkManager.disconnectUser(socket)
            setImageURL([]);
          }}
        >
          Remove Images
        </button>
        </div>
        {/* {<label onClick={print}>printing</label>} */}
      </div>
    </>
  );
}
