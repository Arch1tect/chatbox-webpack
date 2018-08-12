import chatboxConfig from './config.js'
import chatboxUtils from './utils.js'


export default {
	socket: null,
	userCount: 1,
	registerCallback: function(socket, event, cb) {
		socket.on(event, cb);
	}
}