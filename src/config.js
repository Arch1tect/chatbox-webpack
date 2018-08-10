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
	location: 'https://www.nytimes.com/',
	userId: '97aa43c3-77767d5eaba7cc7',
	// userId: '2',
	username: 'King David',
	socketUrl: socketUrl,
	apiUrl : apiUrl,
	s3Url: 'https://s3.amazonaws.com/chat.anywhere.user.img/',
	chatbot : {
		name: 'chat bot',
		userId: 'chat-bot-id'
	}
}
