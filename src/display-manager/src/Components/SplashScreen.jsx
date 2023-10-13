/* eslint-disable no-mixed-spaces-and-tabs */
import './SplashScreen.css'
import WifiIcon from '../images/wifi.png'
import UploadIcon from '../images/Upload.png'

export default function SplashScreen(props) {
	return (
		<div id="splash-root" style={props.style}>
			<div id="title">
				<h1 className='subheading'>Team</h1>
				<h1 className='teamname'>HelloWorld</h1>
				<h1 className='subheading'>Presents</h1>
			</div>
			<div id="instructions">
				<div className="stepCards" id="step1">
					<h1> STEP 1 </h1>
					<p> Connect to <br/> HELLOWORLD <br/> Network </p>
				</div>
				<div className="stepCards" id="step2">
					<h1> STEP 2 </h1>
					<p> Scan Barcode </p>
				</div>
				<div className="stepCards" id="step3">
					<h1> STEP 3 </h1>
					<p>Upload Images</p>
				</div>
			</div>

			 {/* These are images and decorations */}
			<div style={props.qrCode} className='imgPodQR'>
				<div/>
				<div/>
			</div>
			<img src={WifiIcon} className="graphics" id="wifi-icon"/>
			<img src={UploadIcon} className="graphics" id="upload-icon"/>
		</div>
	)
}
