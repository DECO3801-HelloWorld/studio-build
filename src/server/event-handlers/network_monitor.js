
/**
 * Handle the discovery of a new device on the network by the 
 * python listening service. 
 * @param socket The socketio instance that the request came from.
 */
export const handle_new_connection = (socket) => (data) => {
    console.log("=====");
    console.log("Heard new device ___ on network.");
    console.log("The data is: ", data);
    console.log("=====");
}

/**
 * Handle the discovery of disconnected device from the network by the 
 * python listening service. 
 * @param socket 
 */
export const handle_lost_connection = (socket) => (data) => {
    console.log("=====");
    console.log("Lost connection to ___.");
    console.log("The data is: ", data.ip);
    console.log("=====");
	const payload = { userId: ip2int(data.ip)}
	socket.broadcast.emit("display_remove_all_image", payload)
	console.log(`User ${payload.userId} requested a remove all images`)
}

function ip2int(ip) {
    return ip.split('.').reduce(function(ipInt, octet) { return (ipInt<<8) + parseInt(octet, 10)}, 0) >>> 0;
}
