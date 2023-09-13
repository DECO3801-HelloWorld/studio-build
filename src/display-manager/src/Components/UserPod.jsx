import '../App.css'
import './UserPod.css'

/* The UserPod(s) are an element that are going to render a small icon for each
*  user
*/
export default function UserPod({ data }) {
	return (
		<div className="userPod" style={data.style} >
		userPod
		</div>
	)
}
