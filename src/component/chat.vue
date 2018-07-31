<template>
    <div v-show="state.view==2" class="socketchatbox-chatroom-wrapper">
        <div id="socketchatbox-chatroom-title" class="socketchatbox-page-title">
            <font-awesome-icon icon="sync-alt" title='Re-enter chatroom' data-toggle="tooltip" data-placement="bottom" id='socketchatbox-refresh' />
            <span id="socketchatbox-chatroom-url" data-toggle="tooltip" data-placement="bottom">{{chatbox.location}}</span>
        </div>
        <div ref="chatArea" class="socketchatbox-chatArea">
            <div class="socketchatbox-messages">

                <div v-bind:class="{ 'socketchatbox-message': true, 'socketchatbox-message-me': msg.me, 'merge-above': msg.fromSameUser && !msg.loggingTime }" v-for="msg in messages">
                    <div class="socketchatbox-log" v-if="msg.isLog">{{msg.message}}</div>
                    <div v-else>
                        <div v-if="!msg.fromSameUser || msg.loggingTime" class="socketchatbox-msg-username">
                            <span @click="viewUser(msg)">{{msg.username}}</span>
                        </div>
                        <br v-if="msg.me||msg.fromSameUser"/>
                        <div v-if="msg.renderType=='media'" class="socketchatbox-messageBody image-or-video"><img class="chatbox-image" v-bind:src="msg.message" /></div>
                        <div v-if="msg.renderType=='file'" class="socketchatbox-messageBody"><a target='_blank' v-bind:download="msg.fileName" v-bind:href="msg.file">{{msg.fileName}}</a></div>
                        <!-- use v-html because message contain html due to adding class to emoji -->
                        <div v-if="msg.renderType=='text'" v-html="msg.message" class="socketchatbox-messageBody"></div>
                        <div v-if="msg.renderType=='emoji-only'" class="socketchatbox-messageBody emoji-only">{{msg.message}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
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
.socketchatbox-msg-username {
  display: table-cell;
  cursor: pointer;
}
.socketchatbox-message-me .socketchatbox-msg-username {
  float: right;
  padding-right: 5px;
}
.socketchatbox-message-others .socketchatbox-msg-username {
  cursor: pointer;
  padding-left: 5px;
}
.socketchatbox-message-others .socketchatbox-msg-username:hover {
  color: #0089ff;
}
.socketchatbox-message {
  width: 100%;
  display: inline-block;
  margin-bottom: 15px;
}
.socketchatbox-message img{
  max-width: 50%;
  border-radius: 5px;
}
.socketchatbox-message video{
  max-width: 100%;
}
.socketchatbox-log {
  color: #9E9E9E;
  font-size: 11px;
  margin-top: 30px;
  margin-bottom: 10px;
  padding: 0px;
  text-align: center;
}
.socketchatbox-messageBody {
  max-width: 70%;
  margin-top: 7px;
  background-color: #FFFFFF;
  border-radius: 5px;
  box-shadow: 0 0 6px #B2B2B2;
  display: inline-block;
  padding: 10px;
  position: relative;
  vertical-align: top;
  line-height: 18px;
  font-size: 12px;
  word-wrap: break-word;
}
.merge-above .socketchatbox-messageBody{
  margin-top:-20px;
}
.socketchatbox-message-me .socketchatbox-messageBody {
  background: #BBFF00;
}
.socketchatbox-message-me .socketchatbox-messageBody {
  float: right;
}
.socketchatbox-message-me img {
  float: right;
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

#socketchatbox-chatroom-url {
  cursor: pointer;
}
#socketchatbox-chatroom-title {
  white-space: nowrap;
  text-overflow: ellipsis;
}

.socketchatbox-chatArea {
    box-sizing: border-box;
  width: 100%;
  height: calc(100% - 30px);
  overflow-y: auto; /*only show scroll bar when needs to*/
  border: none; 
  padding-right: 10px;
  padding-left: 10px;
  padding-top: 30px;
}
</style>
<script>
import * as io from 'socket.io-client'
import * as moment from 'moment';
import Vue from 'vue'

import chatboxUIState from '../ui-state.js'
import chatbox from '../config.js'
import chatboxUtils from '../utils.js'


"use strict";

var useDifferentStyleForPureEmoji = false;
var LOG_MESSAGE_TIME_AFTER = 1*60*1000 // 1 min

export default {
    name: 'chat-body',
    data () {
        return {
            state: chatboxUIState,
            chatbox: chatbox,
            messages: [],
            lastMsg: {}
        }
    },
    methods: {
        viewUser: function (msg) {
            chatbox.goToMessage(msg.sender, msg.username);
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
                dataCopy.sender = chatbox.userId;
                dataCopy.username = chatbox.username;
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
                if (msg.isLog) {
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
            var now = moment.now();
            data.time = now;
            if (!this.lastMsg.time || (now - this.lastMsg.time > LOG_MESSAGE_TIME_AFTER)) {
                var log = {
                    isLog: true,
                    time: now,
                };
                this.messages.push(log);
                this.updateLogTime();
                data.loggingTime = true;
            }
        },
        processMsg: function (data) {
            this.preprocessMsg(data);
            if (data.sender == chatbox.userId)
                data.me = true;

            if (this.lastMsg && data.sender == this.lastMsg.sender)
                data.fromSameUser = true;

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
        }

    },
    created () {
        var _this = this;
        var socket = io(chatbox.socketUrl, {path:'/socket.io'});
        chatbox.socket = socket;
        this.loadTestData();
        this.keepUpdatingLogTime();

        // Once connected, user will receive the invitation to login using uuid
        socket.on('login', function (data) {
            socket.emit('login', {
                username: chatbox.username,
                uuid: chatbox.userId,
                roomID: chatbox.location,
                url: location.href,
                referrer: document.referrer
            });
        });
        // Whenever the server emits 'new message', update the chat body
        socket.on('new message', function (data) {
            _this.processMsg(data);
            chatboxUtils.queueDanmu(data, true);
        });
        // Received file
        socket.on('base64 file', function (data) {
            data.isFile = true;
            _this.processMsg(data);
        });
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
        username: chatbox.username,
        sender: chatbox.userId,
        message: 'The resize property does not apply to inline elements or to block elements where overflow="visible".'
    },
    {
        username: 'Peter',
        sender: '2',
        message: 'Sounds good.'
    },
    {
        username: chatbox.username,
        sender: chatbox.userId,
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
        username: chatbox.username,
        sender: chatbox.userId,
        message: 'My cool emoji 😂😂😂'
    },
    {
        username: 'Luna',
        sender: '1',
        message: 'Super cool emoji 😎😎😎'
    },
    {
        username: chatbox.username,
        sender: chatbox.userId,
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
        username: chatbox.username,
        sender: chatbox.userId,
        message: "From its humble beginnings in 1999, Emojis are all the rage these days. 😄😄 It's no longer something that only people half our age use to communicate. 😄😄😄"
    },
    {
        username: chatbox.username,
        sender: chatbox.userId,
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
