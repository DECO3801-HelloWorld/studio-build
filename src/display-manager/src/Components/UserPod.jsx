import '../App.css'
import './UserPod.css'

/* The UserPod(s) are an element that are going to render a small icon for each
*  user
*/
export default function UserPod({style}) {
	return (
		<div className="userPod" style={style} top="5px" right="5px">
		</div>
	)
}
