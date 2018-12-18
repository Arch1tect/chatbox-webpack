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
// Weird to manage this myself, but it's for vue binding
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
function _disconnect () {
	if (!state.connected) {
		console.log('not connected, no need to disconnect');
		return;
	}
	console.log('disconnect now');
	socket.disconnect();
	state.connected = false;
	// once receive disconnect event, we'll set state.connected = false;
	// this is instant when disconnect() is call by client
}
function _connect () {
	console.log('connect now');
	if (socket) {
		console.log('exisitng socket connect again');
		if (!state.connected) {
			socket.connect();
		}
	} else {
		console.log('socket first time init');
		_init();
	}
}
export default {
	// socket: null,
	state: state,
	userCount: 0,
	disconnect: function () {
		_disconnect();
	},
	getSocket: function () {
		return socket;
	},
	isConnected: function () {
		return state.connected;
	},
	connect: function () {
		_connect();
	},
	reconnect: function () {
		_disconnect();
		// Has to wait 1 sec, otherwise extra socket is created...
		setTimeout(function(){
			_connect();
		}, 2000);
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