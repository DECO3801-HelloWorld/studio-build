import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import * as NetworkManager from "./Components/NetworkManager.jsx";
import "./App.css";

//Server variables
const serverPort = "5173"; //Might change in future
const socket = io.connect("http://localhost:" + serverPort); //Socket is connection to server

//Testing Variables
const userId = 1; //Maybe grab this from server in future
const userName = "Test User"; //Device name maybe?

export default function App() {
  const [imageURL, setImageURL] = useState([]);
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
              id: crypto.randomUUID(),
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
        console.log(imageURL.name);
      });
    }
  }

  function uploadFxn() {
    return (
      <div className="box">
        <label className="file-uploader-container">
          <div className="centered-content">
            <img src="src\Components\Upload icon.png" />
          </div>
          <div>
            <span className="uploadText">Upload your Image</span>
          </div>
          <div className="uploadText2">
            Supported formates: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
          </div>
        </label>
      </div>
    );
  }
  function imgMapFxn() {
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
      {/*Upload button*/}
      <div className="wapper">
        <div className="header">
          <div className="headerText">MagicShare</div>
        </div>
        <div className="text"> Connected to Screen X123 </div>
        {imageURL.length === 0 ? uploadFxn() : imgMapFxn()}
        <div className="button">
          <button
            htmlFor="imgUpload"
            onClick={() => fileUploadButton.current.click()}>Start Presenting</button>
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
          onClick={() => NetworkManager.disconnectUser(socket)}
        >
          Disconnect
        </button>
        </div>
        {/* {<label onClick={print}>printing</label>} */}
      </div>
    </>
  );
}
