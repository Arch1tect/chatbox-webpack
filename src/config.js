// This is being used not only as config file
// but also for passing variables between components
"use strict";

var localSocketServer = false;
var localInboxServer = false; // DB APIs
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
	version: '2.3.6',
	detectLocation: true,
	lang: 'en', // or zh
	userId: null,
	shareLocation: true,
	livechatDanmu: true,
	invitationDanmu: 'any_site', // never, same_site, any_site
	samePageChat: false, // same page chat VS same site chat
	username: null,
	aboutMe: null,
	socketUrl: socketUrl,
	apiUrl : apiUrl,
	s3Url: 'https://s3.amazonaws.com/chat.anywhere.user.img/',
	chatbot : {
		name: 'Chat Bot',
		userId: 'chat-bot-id'
	},

	// data for passing around
	location: 'https://www.youtube.com/',
	domain: 'https://www.youtube.com/',
	redirected: false,
	commentsTotal: 0,
	pageTitle: null,
	unreadLiveMsgTotal: 0,
	unreadDirectMsg: 0,
	tabVisible: true,
	directMsgEnabled: true,
	liveChatEnabled: true, // this is per page
}
