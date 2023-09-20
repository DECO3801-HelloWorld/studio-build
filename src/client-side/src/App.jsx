import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import * as NetworkManager from "./Components/NetworkManager.jsx";
import "./App.css";

//Server variables
const port = typeof process !== "undefined" ? (typeof process !== 'undefined') ? (process.env.PORT || 3001) : 3001 : 3001;
const socket = io.connect("http://localhost:" + port); //Socket is connection to server
console.log("initial value "+socket.connected);
var count =0;

//Testing Variables
const userId = 1; //Maybe grab this from server in future
const userName = "Test User"; //Device name maybe?

export default function App() {
  const [imageURL, setImageURL] = useState([]);
  const [isConnected, setIsConnected] =useState(false);
  //Grab Upload button
  const fileUploadButton = useRef(null);
  

  /* uploadFile()
   *  ------------------------
   *  Uploads the file from the input element with id "imgUpload" to the server
   *  Requires:
   *		userId, UserName and socket global variables are initialised
   */
  function uploadFile(e) {
    const file = NetworkManager.getFile(fileUploadButton);
    const imgPacket = NetworkManager.packImage(file, userId, userName);
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

  function status(){
    return (
      isConnected == true ? (<div className="text"> Connected to Server </div>):(<div className="text"> Not Connected to Server </div>)
    );
  }

  function uploadFxn() {
    return (
      <div className="box">
        <label className="file-uploader-container">
          <div className="centered-content">
            <img src="src\Components\Upload icon.png" />
          </div>
          <div>
            <button className = "uploadButton" htmlFor="imgUpload" onClick={() => fileUploadButton.current.click()}>
            <span className="uploadText">Upload your Image</span>
            </button>
          </div>
          <div className="uploadText2">
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
      <div className="uploadedImage" key={image.id}>
        <img src={image.URLs} alt="Woops" />
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
      <div className="wapper">
        <div className="header">
          <div className="headerText">MagicShare</div>
        </div>
        {status()}
        {imageURL.length === 0 ? uploadFxn() : imgMapFxn()}
        <div className="button">
          <button
            htmlFor="imgUpload"
            onClick={() => fileUploadButton.current.click()}
          >
            Start Presenting
          </button>
          <input
            type="file"
            ref={fileUploadButton}
            onChange={uploadFile}
            id="imgUpload"
          />
        </div>
        <div>
          <button
            className="button2"
            htmlFor="Disconnect"
            onClick={() => NetworkManager.disconnectUser(socket) & setIsConnected(false)}
          >
            Disconnect
          </button>
          {/* {<div>
            <button className="button" onClick={print}>
              print socket
            </button>
          </div>} */}
        </div>
        {/* {<label onClick={print}>printing</label>} */}
      </div>
    </>
  );
}
