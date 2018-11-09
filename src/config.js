// This is being used not only as config file
// but also for passing variables between components
"use strict";

var localSocketServer = false;
var localInboxServer = true;
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
	version: '1.7.5',
	detectLocation: true,
	location: 'https://www.youtube.com/',
	userId: null,
	shareLocation: true,
	username: null,
	socketUrl: socketUrl,
	apiUrl : apiUrl,
	s3Url: 'https://s3.amazonaws.com/chat.anywhere.user.img/',
	chatbot : {
		name: 'Chat Bot',
		userId: 'chat-bot-id'
	},
	// data for passing around
	commentsTotal: 0,
	unreadLiveMsgTotal: 0,
	unreadDirectMsg: 0,
	tabVisible: true,
	liveChatEnabled: false, // this is per page
}
