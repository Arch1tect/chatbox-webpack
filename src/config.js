"use strict";

var localSocketServer = false;
var localInboxServer = false;
var socketUrl = 'https://quotime.me'
var apiUrl = socketUrl;

if (localSocketServer){
	socketUrl = 'http://localhost:8088';
}
if (localInboxServer) {
	apiUrl = 'http://localhost:9000';
}

export default {
	// testing: true,
	version: '1.1.2',
	detectLocation: true,
	location: 'https://www.youtube.com/',
	userId: null,
	// userId: '2',
	username: null,
	socketUrl: socketUrl,
	apiUrl : apiUrl,
	s3Url: 'https://s3.amazonaws.com/chat.anywhere.user.img/',
	chatbot : {
		name: 'Chat Bot',
		userId: 'chat-bot-id'
	}
}
