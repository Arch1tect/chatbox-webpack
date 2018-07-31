"use strict";

var localSocketServer = false;
var localInboxServer = false;
var socketUrl = 'https://quotime.me'
var commentUrl = socketUrl;
var inboxUrl = socketUrl;

if (localSocketServer){
	socketUrl = 'http://localhost:8088';
}
if (localInboxServer) {
	commentUrl = 'http://localhost:9000';
	inboxUrl = 'http://localhost:9000';
}

export default {

	location: 'https://www.zhihu.com/',
	userId: '97aa43c3-67d5eaba7cc7',
	username: 'haha',
	socketUrl: socketUrl,
	commentUrl : commentUrl,
	inboxUrl : inboxUrl,
	chatbot : {
		name: 'chat bot',
		userId: 'chat-bot-id'
	}
}
