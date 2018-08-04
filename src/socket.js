import * as io from 'socket.io-client'

import chatboxConfig from './config.js'
import chatboxUtils from './utils.js'

console.log('create web socket');
var socket = io(chatboxConfig.socketUrl, {path:'/socket.io'});
export default {
	socket: socket,
	userCount: 1,
	registerCallback: function(event, cb) {
		socket.on(event, cb);
	}
}