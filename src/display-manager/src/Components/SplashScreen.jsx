/* eslint-disable no-mixed-spaces-and-tabs */
import './SplashScreen.css'

export default function SplashScreen(props) {
	return (
		<div id="splash-root" style={props.style}>
			<div id="title">
				<h1 className='subheading'>Team</h1>
				<h1 className='teamname'>HelloWorld</h1>
				<h1 className='subheading'>Presents</h1>
			</div>
		</div>
	)
}
