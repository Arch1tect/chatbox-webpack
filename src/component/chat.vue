<template>
    <div v-show="state.view==2">
        <div class="onlineUsersWrapper"><online-users></online-users></div>

        <div id="socketchatbox-chatroom-title" class="socketchatbox-page-title">
        <span v-bind:title="socket.state.connected ? 'Disconnect' : 'Disconnect'"  @click="toggleConnection"><font-awesome-icon icon="power-off" class="fa fa-power-off" data-toggle="tooltip" data-placement="bottom"/></span>
        <span data-toggle="tooltip" data-placement="bottom" title='Connection status' id='socketchatbox-online-usercount' class='badge' v-bind:class="{connected: socket.state.connected}"> {{socket.state.connected? 'Live': 'Offline'}}
        </span>
            <span data-toggle="tooltip" data-placement="bottom">{{socket.userCount}} people are on this page.</span>
        </div>
        <div ref="chatArea" class="socketchatbox-chatArea">
            <div class="socketchatbox-messages">

                <div v-bind:class="{ 'socketchatbox-message': true, 'socketchatbox-message-me': msg.me, 'merge-above': msg.fromSameUser && !msg.loggingTime }" v-for="msg in messages">
                    <div class="socketchatbox-log" v-if="msg.isLog">{{msg.message}}</div>
                    <div v-else>
                        <span v-if="!msg.fromSameUser || msg.loggingTime">
                            <img class="user-avatar" @click="viewUser(msg)" v-bind:src="msg.profileImgSrc" />
                            <span class="message-name">{{msg.username}}</span>
                            <br />
                        </span>
                        <span v-else class="user-avatar-placeholder"></span>

                        <div v-if="msg.renderType=='media'" class="socketchatbox-messageBody image-or-video"><img class="chatbox-image" v-bind:src="msg.message" /></div>
                        <div v-if="msg.renderType=='file'" class="socketchatbox-messageBody"><a target='_blank' v-bind:download="msg.fileName" v-bind:href="msg.file">{{msg.fileName}}</a></div>
                        <!-- use v-html because message contain html due to adding class to emoji -->
                        <div v-if="msg.renderType=='text'" v-html="msg.message" class="socketchatbox-messageBody"></div>
                        <div v-if="msg.renderType=='emoji-only'" class="socketchatbox-messageBody emoji-only">{{msg.message}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="typing" class="chat-typing">{{typing}}</div>
    </div>
</template>
<style>
#socketchatbox-online-usercount {
    line-height: 15px;
    background: gray;
    margin-right: 5px;
    padding: 3px 7px;
    /* font-size: 12px; */
    /* font-weight: 700; */
    color: #fff;
    /* text-align: center; */
    /* white-space: nowrap; */
    /* vertical-align: middle; */
    /* margin-bottom: 2px; */
    border-radius: 5px;
}
.chat-typing {
    width: 100%;
    z-index: 1;
    position: fixed;
    color: white;
    text-align: center;
    bottom: 35px;
    padding: 8px;
    background: #0189feba;
}
.socketchatbox-chatArea {
    /*background: #eafaff;*/
  width: 100%;
  height: calc(100% - 30px);
  overflow-y: auto; /*only show scroll bar when needs to*/
  padding-right: 10px;
  padding-left: 10px;
  padding-top: 30px;
}
.message-name {
    color: gray;
    margin-left: 10px;
    float: left;
}
.socketchatbox-message-me .message-name {
    margin-left: 0px;
    margin-right: 10px;
    float: right;
}
.socketchatbox-messagetime {
  color: gray;
}
.inline-emoji {
  font-size: 18px;
  bottom: -3px;
  position: relative;
}
.socketchatbox-messages {
  padding: 0;
}
/*.socketchatbox-msg-username {
  display: table-cell;
}*/
.user-avatar {
    cursor: pointer;
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 100%;
    /*border-radius: 5px;*/
    /*border: 1px solid gray;*/
    box-shadow: 0 0 6px black;
}
.socketchatbox-message-me .user-avatar {
  float: right;
}
.user-avatar-placeholder {
    width: 40px;
    height: 5px;
    float: left;
}
.socketchatbox-message-me .user-avatar-placeholder {
    float: right;
}

.socketchatbox-message {
  width: 100%;
  display: inline-block;
  margin-bottom: 15px;
}
.socketchatbox-messageBody img{
  max-width: 50%;
  border-radius: 5px;
}
.socketchatbox-message video{
  max-width: 100%;
}
.socketchatbox-log {
  color: #9E9E9E;
  font-size: 11px;
  margin-top: 10px;
  margin-bottom: 5px;
  padding: 0px;
  text-align: center;
}
.socketchatbox-messageBody {
  max-width: calc(100% - 100px);
  /*min-width: 48px;*/
  float: left;
  margin-top: 5px;
  margin-left: 10px;
  background-color: #FFFFFF;
  border-radius: 5px;
  box-shadow: 0 0 6px #B2B2B2;
  display: inline-block;
  padding: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  position: relative;
  vertical-align: top;
  line-height: 18px;
  font-size: 12px;
  word-wrap: break-word;
}
.merge-above {
  margin-top: -15px;
}
.socketchatbox-message-me img {
    float: right;
}
.socketchatbox-message-me .socketchatbox-messageBody {
    float: right;
    background: #BBFF00;
    margin-right: 10px;
}
.socketchatbox-messageBody.emoji-only {
  font-size:xx-large;
  background:none;
  box-shadow:none;
  padding: 0px;
}
.socketchatbox-messageBody.image-or-video {
  background:none;
  box-shadow:none;
  padding: 0px;
  border-radius: 5px;
}
</style>
<style>

button {
    background: #00a1ff;
    color: white;
}
</style>
<script>
import * as moment from 'moment';
import Vue from 'vue'

import chatboxUIState from '../ui-state.js'
import chatboxConfig from '../config.js'
import chatboxUtils from '../utils.js'
import chatboxSocket from '../socket.js'


"use strict";
const TYPING_STAY_TIME = 3*1000; // ms

var useDifferentStyleForPureEmoji = false;
var LOG_MESSAGE_TIME_AFTER = 1*60*1000; // 1 min
var typingUserDict = {};
export default {
    name: 'chat-body',
    data () {
        return {
            state: chatboxUIState,
            socket: chatboxSocket,
            chatboxConfig: chatboxConfig,
            messages: [],
            lastMsg: {},
            typing: null
        }
    },
    methods: {
        viewUser: function (msg) {
            chatboxUtils.viewOthersProfile(2, msg.sender, msg.username);
        },
        scrollToBottom: function () {
            this.$refs.chatArea.scrollTop = this.$refs.chatArea.scrollHeight;
        },
        scrollToBottomLater: function () {
            var _this = this;
            setTimeout(function() {_this.scrollToBottom()}, 100);
        },
        loadTestData: function () {
            var i = 0;
            for (; i<testData.length; i++) {
                var data = testData[i];
                var dataCopy = chatboxUtils.deepCopy(data);
                // try testcase by me and by others
                this.processMsg(data);
                dataCopy.sender = chatboxConfig.userId;
                dataCopy.username = chatboxConfig.username;
                this.processMsg(dataCopy);
            }
            i = 0;
            for (; i< testData2.length; i++) {
                this.processMsg(testData2[i]);
            }
        },
        updateLogTime: function () {
            var i = 0;
            for (; i < this.messages.length; i++) {
                var msg = this.messages[i];
                if (msg.isLog && msg.time) {
                    msg.message = moment(msg.time).fromNow()
                    Vue.set(this.messages, i, msg);
                }
            }
        },
        keepUpdatingLogTime: function () {
            var _this = this;
            this.updateLogTime();
            setTimeout(function(){
                _this.keepUpdatingLogTime()
            }, 60*1000);
        },
        preprocessMsg: function (data) {
            // May need to add log
            // if loading from cache, there's timestamp on message
            if (!data.time)
                data.time = moment.now();
            if (!this.lastMsg.time || (data.time - this.lastMsg.time > LOG_MESSAGE_TIME_AFTER)) {
                var log = {
                    isLog: true,
                    time: data.time,
                };
                this.messages.push(log);
                this.updateLogTime();
                data.loggingTime = true;
            }
        },
        processMsg: function (data) {
            this.preprocessMsg(data);
            if (data.sender == chatboxConfig.userId)
                data.me = true;

            if (this.lastMsg && data.sender == this.lastMsg.sender)
                data.fromSameUser = true;

            chatboxUtils.tryLoadingProfileImg(data, data.sender);
            // Maybe move some of this logic to backend, it's messy here
            // Message is considered media type if
            // 1. text: image url
            // 2. file: image file

            if (data.isFile) {
                if (data.file.substring(0,10)==='data:image' || data.file.substring(0,10)==='data:video') {
                    data.renderType = 'media';
                    data.message = data.file;
                } else {
                    data.renderType = 'file';
                }
            } else {
                if (data.message.match(/\.(jpeg|jpg|gif|png)$/) !== null) {
                    data.renderType = 'media';
                } else {
                    if (useDifferentStyleForPureEmoji && chatboxUtils.isPureEmoji(data.message))
                        data.renderType = 'emoji-only';
                    else {
                        data.renderType = 'text';
                        data.message = chatboxUtils.addClassToEmoji(data.message);
                    }
                }
            }

            this.messages.push(data);
            this.lastMsg = data;
            var _this = this;
            Vue.nextTick(function(){
                _this.scrollToBottom();
            });
            if (data.renderType == 'media') {
                // Media takes time to load
                this.scrollToBottomLater();
            }
        },
        // Add typing user, auto remove after centain amount of time
        addTypingUser: function (username) {
            if (username === chatboxConfig.username) return;

            if (username in typingUserDict) {
                clearTimeout(typingUserDict[username]);
            } 
            var _this = this;
            typingUserDict[username] = setTimeout(function() {
                _this.removeTypingUser(username);
            }, TYPING_STAY_TIME);

            this.updateTypingInfo();
        },
        // Removes typing user
        removeTypingUser: function (username) {
            if (username in typingUserDict) {
                clearTimeout(typingUserDict[username]);
            } 
            delete typingUserDict[username];
            this.updateTypingInfo();
        },
        updateTypingInfo: function () {
            var msg = '';
            var typingUserCount = Object.keys(typingUserDict).length;
            if (typingUserCount > 0) {
                if (typingUserCount === 1){
                     msg = Object.keys(typingUserDict)[0] + ' is typing';
                } else if (typingUserCount === 2) {
                    msg = Object.keys(typingUserDict)[0] + ' and ' + Object.keys(typingUserDict)[1] + ' are typing';
                } else if (typingUserCount ===3) {
                    msg = Object.keys(typingUserDict)[0] + ', ' + Object.keys(typingUserDict)[1] + 
                    ' and ' + Object.keys(typingUserDict)[2] + ' are typing';
                } else {
                    msg = Object.keys(typingUserDict)[0] + ', ' + Object.keys(typingUserDict)[1] + 
                    ', ' + Object.keys(typingUserDict)[2] + ' and ' + (typingUserCount-3) + ' other users are typing';
                }
                this.typing = msg;
            } else {
                this.typing = null;
            }
        },
        saveMsgToStorage: function (data) {
            chatboxUtils.storage.get(chatboxConfig.location, function(item) {
                var messages = [];
                if (item && item[chatboxConfig.location])
                    messages = JSON.parse(item[chatboxConfig.location]);
                // avoid saving message multiple times if
                // user open multiple tabs of same page
                if (!messages.length || messages[messages.length-1].message !== data.message) {
                    var msg = {
                        message: data.message+'',
                        sender: data.sender+'',
                        time: data.time,
                        username: data.username+''
                    }
                    messages.push(msg);
                    chatboxUtils.storage.set(chatboxConfig.location, JSON.stringify(messages));
                }
            });
        },
        registerSocketEvents: function () {
            var _this = this;
            // Once connected, user will receive the invitation to login using uuid
            chatboxSocket.registerCallback('login', function (data) {
                chatboxSocket.getSocket().emit('login', {
                    username: chatboxConfig.username,
                    userId: chatboxConfig.userId,
                    roomId: chatboxConfig.location,
                    shareLocation: chatboxConfig.shareLocation,
                    version: chatboxConfig.version
                });
            });
            chatboxSocket.registerCallback('disconnect', function (data) {
                chatboxSocket.state.connected = false;
            });
            chatboxSocket.registerCallback('name changed', function (data) {
                var log = {
                    isLog: true,
                    message: data.oldName+' changed name to '+data.username
                };
                _this.messages.push(log);
                _this.scrollToBottomLater();
            });
            chatboxSocket.registerCallback('typing', function (data) {
                _this.addTypingUser(data.username);
            });
            chatboxSocket.registerCallback('stop typing', function (data) {
                console.log('remove typing ' + data.username)
                _this.removeTypingUser(data.username);
            });
            // Whenever the server emits 'new message', update the chat body
            chatboxSocket.registerCallback('new message', function (data) {
                if (_this.state.view != 2 || _this.state.display != 'full') {
                    chatboxConfig.unreadLiveMsgTotal ++;
                }
                _this.processMsg(data);
                chatboxUtils.queueDanmu(data, true);
                _this.saveMsgToStorage(data);
            });
            // Received file
            chatboxSocket.registerCallback('base64 file', function (data) {
                data.isFile = true;
                _this.processMsg(data);
            });
        },
        addIntro: function () {
            var log = {
                isLog: true,
                message: 'Live chat with other people on this page!'
            };
            this.messages.push(log);
        },
        toggleConnection: function () {
            if (this.socket.state.connected) {
                this.socket.disconnect();
            } else {
                this.socket.connect();
            }
        }

    },
    watch: {
        'state.view': function (newView, prevView) {
            if (newView == 2) {
                chatboxConfig.unreadLiveMsgTotal = 0;
            }
        }
    },
    mounted () {

        if (chatboxConfig.testing)
            this.loadTestData();
        this.keepUpdatingLogTime();
        var _this = this;
        // load chat history from storage
        chatboxUtils.storage.get(chatboxConfig.location, function(item) {
            if (item && item[chatboxConfig.location]) {
                var messages = JSON.parse(item[chatboxConfig.location]);
                var i = 0;
                for (; i< messages.length; i++)
                    _this.processMsg(messages[i]);
            }
        });
        this.addIntro();

        this.registerSocketEvents();
    }
}




/*
Name id
Luna: 1
Peter: 2
Nick: 3
*/
var testData = [
    {
        username: chatboxConfig.username,
        sender: chatboxConfig.userId,
        message: 'The resize property does not apply to inline elements or to block elements where overflow="visible".'
    },
    {
        username: 'Peter',
        sender: '2',
        message: 'Sounds good.'
    },
    {
        username: chatboxConfig.username,
        sender: chatboxConfig.userId,
        message: 'Yeah.'
    },
    {
        username: 'Peter',
        sender: '2',
        message: 'The resize property controls if and how an element can be resized by the user by clicking and dragging the bottom right corner of the element.'
    },
    {
        username: 'Peter',
        sender: '2',
        message: 'The resize property controls if and how an element can be resized by the user by clicking and dragging the bottom right corner of the element.'
    },
    {
        username: chatboxConfig.username,
        sender: chatboxConfig.userId,
        message: 'My cool emoji 😂😂😂'
    },
    {
        username: 'Luna',
        sender: '1',
        message: 'Super cool emoji 😎😎😎'
    },
    {
        username: chatboxConfig.username,
        sender: chatboxConfig.userId,
        message: '😝'
    },
    {
        username: 'Luna',
        sender: '1',
        message: '🐳'
    },
    {
        username: 'Luna',
        sender: '1',
        message: '🐳🐳🐳'
    },
    {
        username: 'Nick',
        sender: '3',
        message: '😄😄😄😄😄😄😄😄😄😄😄😄😄😄😄😄😄😄'
    },
    {
        username: chatboxConfig.username,
        sender: chatboxConfig.userId,
        message: "From its humble beginnings in 1999, Emojis are all the rage these days. 😄😄 It's no longer something that only people half our age use to communicate. 😄😄😄"
    },
    {
        username: chatboxConfig.username,
        sender: chatboxConfig.userId,
        message: 'stickers/bunny/cheers.gif'
    },
    {
        username: 'Luna',
        sender: '1',
        message: 'stickers/bunny/rubber_face.gif'
    },
    {
        username: 'Luna',
        sender: '1',
        isFile: true,
        fileName: 'resume.pdf',
        file: 'xyz'
    }
]
var testData2 = [
    // Test multiple messages from other people
    {
        username: 'King',
        sender: '4',
        message: "Emojis are all the rage these days. 😄😄 It's no longer something that only people half our age use to communicate. 😄😄😄"
    },
    {
        username: 'Tut',
        sender: '5',
        message: "From its humble beginnings in 1999, Emojis are all the rage these days. 😄😄 It's no longer something that only people half our age use to communicate. 😄😄😄"
    },
    {
        username: 'Tut',
        sender: '5',
        message: "From its humble beginnings in 1999 😄😄😄"
    },
    {
        username: 'Ann',
        sender: '6',
        message: "From its humble beginnings in 1999 😄😄😄"
    }

]
</script>
