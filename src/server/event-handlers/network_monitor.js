
/**
 * Handle the discovery of a new device on the network by the 
 * python listening service. 
 * @param socket The socketio instance that the request came from.
 */
export const handle_new_connection = (socket) => (data) => {
    console.log("Heard new device ___ on network.");
}

/**
 * Handle the discovery of disconnected device from the network by the 
 * python listening service. 
 * @param socket 
 */
export const handle_lost_connection = (socket) => (data) => {
    console.log("Lost connection to ___.");
}