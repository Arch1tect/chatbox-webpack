// This is being used not only as config file
// but also for passing variables between components
"use strict";

var localSocketServer = false;
var localAPI = false; // DB APIs
// var socketUrl = 'https://quotime.me'
var socketUrl = 'https://api.yiyechat.com';
var apiUrl = socketUrl;

if (localSocketServer){
	socketUrl = 'http://localhost:8088';
}
if (localAPI) {
	apiUrl = 'http://localhost:9000';
}

export default {
	// testing: true,
	// When running DB api locally with remote socket server
	socketTokenMustMatchDB: false,
	version: '2.8.0',
	detectLocation: true,
	lang: 'en', // or zh
	userId: null,
	userNumId: null,
	token: null,
	credit: null,
	shareLocation: true,
	livechatDanmu: true,
	invitationDanmu: 'any_site', // never, same_site, any_site
	samePageChat: false, // same page chat VS same site chat
	username: null,
	password: null,
	aboutMe: '',
	socketUrl: socketUrl,
	apiUrl : apiUrl,
	cdnUrl: 'https://dnsofx4sf31ab.cloudfront.net/',
	s3Url: 'https://dnsofx4sf31ab.cloudfront.net/',
	// s3Url: 'https://s3.amazonaws.com/chat.anywhere.user.img/',
	chatbot : {
		name: 'Chat Bot',
		userId: 'chat-bot-id'
	},

	// data for passing around
	location: 'https://www.youtube.com/',
	domain: 'https://www.youtube.com/',
	blockUserDict: {},
	commentsTotal: 0,
	pageTitle: null,
	unreadLiveMsgTotal: 0,
	unreadDirectMsg: 0,
	tabVisible: true,
	directMsgEnabled: true,
	liveChatEnabled: false, // this is per page
}
