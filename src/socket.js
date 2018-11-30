import * as io from 'socket.io-client'

import chatboxConfig from './config.js'
import chatboxUtils from './utils.js'


var socketEventCallbacks = [
	// E.g.
	// {
	// 	event: "login",
	// 	callback: function () {}
	// }
];
var socket = null;
var state = {};
state.connected = false;
function _init() {
	// private, only called by connect()
	socket = io(chatboxConfig.socketUrl, {path:'/socket.io'});
	var i=0;
	for (; i<socketEventCallbacks.length; i++) {
		socket.on(socketEventCallbacks[i].eventName, socketEventCallbacks[i].callback);
	}
	socketEventCallbacks = null; // don't allow event registration after socket created
}
export default {
	// socket: null,
	state: state,
	userCount: 0,
	disconnect: function () {
		if (!state.connected) {
			console.log('not connected, no need to disconnect');
			return;
		}
		console.log('disconnect now');
		socket.disconnect();
		// once receive disconnect event, we'll set state.connected = false;
		// this is instant when disconnect() is call by client
	},
	getSocket: function () {
		return socket;
	},
	isConnected: function () {
		return state.connected;
	},
	connect: function () {
		if (socket) {
			if (!state.connected) socket.connect();
		} else {
			_init();
		}
		// state.connected = true; not really, connection might be slow
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