import * as io from 'socket.io-client'

import chatboxConfig from './config.js'
import chatboxUtils from './utils.js'


var socketEventCallbacks = [
	// E.g.
	// {
	// 	event: "login",
	// 	callback: function () {}
	// }
]
export default {
	socket: null,
	userCount: 1,
	init: function (self) {
		self.socket = io(chatboxConfig.socketUrl, {path:'/socket.io'});
		var i=0;
		for (; i<socketEventCallbacks.length; i++) {
			self.socket.on(socketEventCallbacks[i].eventName, socketEventCallbacks[i].callback);
		}
		socketEventCallbacks = null; // don't allow event registration after socket created
	},
	registerCallback: function(event, cb) {
		if (!socketEventCallbacks) {
			throw 'Chatbox: You should register socket event before socket is created!';
		}
		socketEventCallbacks.push(
			{
				eventName: event,
				callback: cb
			}
		)
	}
}