<style>
    .load-chat-history {
        color: gray;
        cursor: pointer;
        text-decoration: underline;
    }
    .load-chat-history:hover {
        color: #2196F3;
    }
    .stubborn-btn {
        color: #6d6d6d;
        background: #efefef;
        padding: 8px;
        padding-top: 5px;
        padding-bottom: 5px;
        border: 1px solid #dedede;
        border-radius: 3px;
    }
    .stubborn-btn:hover {
        background: white;
        cursor: pointer;
    }
    .stubborn-btn.ok {
        background: #2196F3;
        color: white;
        margin-right: 10px;
    }
    .fa-users {
        /*margin-left: 10px;*/
        /*margin-right: 5px;*/
    }
    .site-page-chat-toggle {
        display: inline-table;
        margin-left: 10px;
        color: white;
        cursor: pointer;
    }
    .toggle-switch {
        padding: 3px 7px;
        background: #d3d3d3;
    }
    .toggle-switch.left-switch {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;

    }
    .toggle-switch.right-switch {
        /*border-left: ;*/
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }
    .toggle-switch.selected {
        background: rgba(0,0,0,.75);
    }
    #socketchatbox-live-status .fa {
        color: white;
    }
    .online-users-btn:hover {
        color: black;
    }
    .online-users-btn:hover .fa{
        color: black;
    }
    #socketchatbox-live-status {
        cursor: pointer;
        line-height: 15px;
        background: lightgray;
        padding: 3px 7px;
        color: #fff;
        border-radius: 5px;
    }
    #socketchatbox-live-status:hover .fa.fa-power-off{
        color: #00ff32;
    }
    #socketchatbox-live-status.connected {
        background: #0089FF;
    }
    #socketchatbox-live-status.connected:hover .fa.fa-power-off{
        color: red;
    }
    .chat-typing {
        width: 100%;
        z-index: 1;
        position: absolute;
        color: white;
        text-align: center;
        bottom: 35px;
        /*top: 60px;*/
        line-height: 18px;
        padding: 10px;
        padding-top: 5px;
        padding-bottom: 5px;
        background: rgba(0, 153, 255, 0.8);
    }
    .redirection-confirmation {
        width: 100%;
        z-index: 5001;
        position: absolute;
        color: black;
        text-align: center;
        bottom: 35px;
        /*top: 60px;*/
        line-height: 18px;
        padding: 10px;
        padding-top: 5px;
        padding-bottom: 5px;
        background: yellow;
    }
    .socketchatbox-chatArea {
        /*background: #eafaff;*/
        width: 100%;
        height: calc(100% - 30px);
        overflow-y: auto; /*only show scroll bar when needs to*/
        padding-right: 10px;
        padding-left: 10px;
        padding-top: 30px;
        padding-bottom: 30px;
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
        max-width: 120px;
        border-radius: 5px;
    }
    .socketchatbox-message video{
        max-width: 100%;
    }
    .socketchatbox-log {
        color: #9E9E9E;
        font-size: 11px;
        line-height: 20px;
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
        cursor: pointer;
    }
    .input-bar-mask {
        height: 35px;
        width: 100%;
        background: #ffffff;
        text-align: center;
        line-height: 35px;
        position: absolute;
        border-top: 1px solid lightgray;
    }
    .input-bar-mask:hover {
        background: #2196F3;
        cursor: pointer;
        color: white;
    }
    .invitations {
        position: absolute;
        left: 10px;
        text-decoration: underline;
    }
    .invitations {
        color: lightgray;
        cursor: pointer;
    }
    .invitations:hover {
        color: black;
    }
    .invitations.active {
        color: black;
    }
    .send-invitation-btn {
        position: absolute;
        left: 70px;
        color: lightgray;
    }
    .send-invitation-btn.active {
        color: orange;
    }
    .online-users-btn {
        cursor: pointer;
        color: lightgray;
        position: absolute;
        right: 10px;
    }
    .online-users-btn.active{
        color: black;
    }
</style>
<template>
    <div v-show="state.view==2">
        <div id="socketchatbox-chatroom-title" class="socketchatbox-page-title">
            <span :title="$t('m.invitations')" class="invitations" v-bind:class="{active: state.chatTopPanel==2}" @click="toggleOnlineUsers(2)">
                <font-awesome-icon icon="bullhorn" class="fa fa-bullhorn" data-toggle="tooltip" data-placement="bottom"/>
            </span>
            <span v-bind:title="socket.state.connected ? $t('m.disconnect') : $t('m.connect')"  @click="toggleConnection" data-toggle="tooltip" data-placement="bottom" id='socketchatbox-live-status' class='badge' v-bind:class="{connected: socket.state.connected}">{{socket.state.connected? $t('m.online'): $t('m.offline')}}
                <font-awesome-icon icon="power-off" class="fa fa-power-off" data-toggle="tooltip" data-placement="bottom"/>
            </span>
            <span class='site-page-chat-toggle' :title="$t('m.toggleSamePageChat')">
                <span @click='toggleSamePageChat(true)' class='toggle-switch left-switch' :class='{selected: config.samePageChat}'>{{$t('m.samePageChat')}}</span>
                <span @click='toggleSamePageChat(false)' class='toggle-switch right-switch' :class='{selected: !config.samePageChat}'>{{$t('m.sameSiteChat')}}</span>
            </span>
            <span class="online-users-btn" :title="$t('m.onlineUsers')" v-bind:class="{active: state.chatTopPanel==1}" v-if="socket.state.connected" @click="toggleOnlineUsers(1)">
                <font-awesome-icon icon="users" class="fa fa-users" data-toggle="tooltip" data-placement="bottom"/><span> {{socket.userCount}}</span>
            </span>
        </div>
        <online-users></online-users>
        <invitations></invitations>
        <div ref="chatArea" class="socketchatbox-chatArea">
            <div class="socketchatbox-messages">
                <center class="load-chat-history" v-if="canLoadChatHistory" @click="loadChatHistory">{{$t('m.loadChatHistory')}}</center>

                <div v-bind:class="{ 'socketchatbox-message': true, 'socketchatbox-message-me': msg.me, 'merge-above': msg.fromSameUser && !msg.loggingTime }" v-for="msg in historyMessages">
                    <div class="socketchatbox-log" v-if="msg.isLog">{{msg.message}}</div>
                    <div v-else>
                        <span v-if="!msg.fromSameUser || msg.loggingTime">
                            <img class="user-avatar" @click="viewUser(msg)" v-bind:src="msg.profileImgSrc" />
                            <span class="message-name">{{msg.username}}</span>
                            <br />
                        </span>
                        <span v-else class="user-avatar-placeholder"></span>

                        <div v-if="msg.renderType=='media'" class="socketchatbox-messageBody image-or-video"><img class="chatbox-image" v-bind:src="msg.message" @click="viewImage(msg.message)"/></div>
                        <div v-if="msg.renderType=='file'" class="socketchatbox-messageBody"><a target='_blank' v-bind:download="msg.fileName" v-bind:href="msg.file">{{msg.fileName}}</a></div>
                        <!-- use v-html because message contain html due to adding class to emoji -->
                        <div v-if="msg.renderType=='text'" v-html="msg.message" class="socketchatbox-messageBody"></div>
                        <div v-if="msg.renderType=='emoji-only'" class="socketchatbox-messageBody emoji-only">{{msg.message}}</div>
                    </div>
                </div>

                <div v-bind:class="{ 'socketchatbox-message': true, 'socketchatbox-message-me': msg.me, 'merge-above': msg.fromSameUser && !msg.loggingTime }" v-for="msg in messages">
                    <div class="socketchatbox-log" v-if="msg.isLog">{{msg.message}}</div>
                    <div v-else>
                        <span v-if="!msg.fromSameUser || msg.loggingTime">
                            <img class="user-avatar" @click="viewUser(msg)" v-bind:src="msg.profileImgSrc" />
                            <span class="message-name">{{msg.username}}</span>
                            <br />
                        </span>
                        <span v-else class="user-avatar-placeholder"></span>

                        <div v-if="msg.renderType=='media'" class="socketchatbox-messageBody image-or-video"><img class="chatbox-image" v-bind:src="msg.message" @click="viewImage(msg.message)"/></div>
                        <div v-if="msg.renderType=='file'" class="socketchatbox-messageBody"><a target='_blank' v-bind:download="msg.fileName" v-bind:href="msg.file">{{msg.fileName}}</a></div>
                        <!-- use v-html because message contain html due to adding class to emoji -->
                        <div v-if="msg.renderType=='text'" v-html="msg.message" class="socketchatbox-messageBody"></div>
                        <div v-if="msg.renderType=='emoji-only'" class="socketchatbox-messageBody emoji-only">{{msg.message}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="typing" class="chat-typing">{{typing}}</div>
        <div v-show="countDown>0" class="redirection-confirmation">
            <p>{{promptMsg}}</p>
            <p>
                <span class="stubborn-btn ok" @click="agreeToPrompt">{{$t('m.goAhead')}}</span>
                <span class="stubborn-btn" @click="stayHere">{{$t('m.stayHere')}}</span>
            </p>
        </div>
        <div @click="toggleConnection" v-show="state.view == 2 && !config.liveChatEnabled" class="input-bar-mask">{{$t("m.connect")}}</div>
    </div>
</template>


<script>
import * as moment from 'moment';
import Vue from 'vue'

import chatboxUIState from '../ui-state.js'
import chatboxConfig from '../config.js'
import chatboxUtils from '../utils.js'
import chatboxSocket from '../socket.js'


"use strict";
const TYPING_STAY_TIME = 3*1000; // ms
const DISCONNECT_DELAY_TIME = 5*60*1000; // 10 min
const MAX_HISTORY_MESSAGE = 50;
const LOG_MESSAGE_TIME_AFTER = 1*60*1000; // 1 min
const COUNT_DOWN = 10;

var useDifferentStyleForPureEmoji = false;

var typingUserDict = {};
var disconnectTimer = null;
var firstTimeAutoScroll = true; // Only auto scroll when maximize for first time
var countDownTimer = null;

export default {
    name: 'chat-body',
    data () {
        return {
            state: chatboxUIState,
            socket: chatboxSocket,
            config: chatboxConfig,
            messages: [],
            historyMessages: [],
            lastMsg: {},
            lastHistoryMsg: {},
            typing: null,
            countDown: 0,
            loadedHistory: null, // SITE/PAGE,
            curSiteChatHisotry: [],
            curPageChatHistory: [],
            countDownType: 'SITE_TO_PAGE',
        }
    },
    computed: {
        promptMsg: function () {
            if (this.countDownType == 'SITE_TO_PAGE') {
                return this.$t('m.foundSamePage', {countDown:this.countDown});
            }
            return this.$t('m.urlChanged', {countDown:this.countDown});
        },
        canLoadChatHistory: function () {
            if (this.loadedHistory)
                return false;
            if (chatboxConfig.samePageChat)
                return this.curPageChatHistory.length > 0;
            if (!chatboxConfig.samePageChat)
                return this.curSiteChatHisotry.length > 0;
            return false;
        }

    },
    methods: {
        agreeToPrompt: function () {
            this.countDownTimeUp();
        },
        stayHere: function () {
            this.countDown = 0;
            if (countDownTimer) clearTimeout(countDownTimer);
            if (this.countDownType == 'SITE_TO_PAGE') {
                chatboxSocket.getSocket().emit('iamStubborn');
                chatboxConfig.stubborn = true;
            }
        },
        countDownTimeUp: function () {
            this.countDown = 0;
            if (this.countDownType == 'URL_CHANGE') {
                // already having same page chat but url change
                chatboxSocket.reconnect();
            } else {
                // same site chat -> same page chat
                this.toggleSamePageChat(true);
            }
        },
        countDownRedirection: function () {
            if (this.countDown == 0) {
                this.countDownTimeUp();
            } else {
                this.countDown --; // place here so we don't get -1 second
                var _this = this;
                if (countDownTimer) clearTimeout(countDownTimer);
                countDownTimer = setTimeout(function () {
                    _this.countDownRedirection();
                }, 1000);
            }

        },
        toggleSamePageChat: function (val) {
            if (chatboxConfig.samePageChat != val) {
                chatboxConfig.samePageChat = val;
                if (chatboxConfig.liveChatEnabled) {
                    Vue.notify({
                        title: this.$t('m.toggleSamePageChatING'),
                        type: 'warning'
                    });
                    this.socket.reconnect();
                }
            }
            if (val && this.countDown > 0 && this.countDownType == 'SITE_TO_PAGE') {
                this.countDown = 0;
                clearTimeout(countDownTimer);
            }
            if (!val) {
                // if user manually change it to same site chat, they are stubborn
                // stubborn in terms of having site chat, not stubborn about
                // page url change prompt
                this.stayHere();

            }
        },
        toggleOnlineUsers: function (val) {
            if (this.state.chatTopPanel != val) {
                this.state.chatTopPanel = val;
            } else {
                this.state.chatTopPanel = 0;
            }
        },
        viewUser: function (msg) {
            chatboxUtils.viewOthersProfile(2, msg.sender, msg.username, msg.hasAvatar);
        },
        viewImage: function (src) {
            chatboxUtils.openImageModal(src);
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
            i = 0;
            for (; i < this.historyMessages.length; i++) {
                var msg = this.historyMessages[i];
                if (msg.isLog && msg.time) {
                    msg.message = moment(msg.time).fromNow()
                    Vue.set(this.historyMessages, i, msg);
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
        preprocessMsg: function (data, historyMessage) {
            // May need to add log
            // if loading from cache, there's timestamp on message

            var lastMsg = this.lastMsg;
            var messages = this.messages;
            if (historyMessage) {
                lastMsg = this.lastHistoryMsg;
                messages = this.historyMessages;
            }

            if (!data.time)
                data.time = moment.now();
            if (!lastMsg.time || (data.time - lastMsg.time > LOG_MESSAGE_TIME_AFTER)) {
                var log = {
                    isLog: true,
                    time: data.time,
                };
                messages.push(log);
                this.updateLogTime();
                data.loggingTime = true;
            }
            },
        processMsg: function (data, historyMessage) {
            this.preprocessMsg(data, historyMessage);
            var lastMsg = this.lastMsg;
            var messages = this.messages;
            if (historyMessage) {
                lastMsg = this.lastHistoryMsg;
                messages = this.historyMessages;
            }

            if (data.sender == chatboxConfig.userId)
                data.me = true;

            if (lastMsg && data.sender == lastMsg.sender)
                data.fromSameUser = true;

            chatboxUtils.tryLoadingProfileImg(data, data.sender, data.me);
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

            if (historyMessage) {
                this.historyMessages.push(data);
                this.lastHistoryMsg = data;
            } else {
                this.messages.push(data);
                this.lastMsg = data;
                var _this = this;
                var newMsgNotVisible = false;
                if (_this.state.view != 2 || _this.state.display != 'full') {
                    newMsgNotVisible = true;
                }
                if (this.hasScrolledToBottom()) {
                    Vue.nextTick(function () {
                        _this.scrollToBottom();
                    });
                    if (data.renderType == 'media') {
                        // Media takes time to load
                        this.scrollToBottomLater();
                    }
                } else {
                    newMsgNotVisible = true;
                }
                if (newMsgNotVisible) chatboxConfig.unreadLiveMsgTotal++;
            }
        },
        // Add typing user, auto remove after centain amount of time
        // TODO: use user id not name
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
            var roomId = chatboxConfig.location;
            if (!chatboxConfig.samePageChat) {
                roomId = chatboxConfig.domain;
            }
            chatboxUtils.storage.get(roomId, function(item) {
                var messages = [];
                if (item && item[roomId])
                    messages = JSON.parse(item[roomId]);
                // avoid saving message multiple times if
                // user open multiple tabs of same page
                if (!messages.length || messages[messages.length-1].message !== data.message) {
                    var msg = {
                        message: data.message+'',
                        sender: data.sender+'',
                        time: data.time,
                        username: data.username+'',
                        hasAvatar: data.hasAvatar
                    }
                    messages.push(msg);
                    if (messages.length > MAX_HISTORY_MESSAGE) {
                        messages = messages.slice(-MAX_HISTORY_MESSAGE);
                    }

                    chatboxUtils.storage.set(roomId, JSON.stringify(messages));
                }
            });
        },
        registerSocketEvents: function () {
            var _this = this;
            // Once connected, user will receive the invitation to login using uuid
            chatboxSocket.registerCallback('login', function (data) {
                var roomId = chatboxConfig.location;
                if (!chatboxConfig.samePageChat) {
                    roomId = chatboxConfig.domain;
                }

                chatboxSocket.getSocket().emit('login', {
                    username: chatboxConfig.username,
                    userId: chatboxConfig.userId,
                    roomId: roomId,
                    url: chatboxConfig.location, // added field in v2.6.0
                    shareLocation: chatboxConfig.shareLocation,
                    version: chatboxConfig.version,
                    lang: chatboxConfig.lang,
                    pageTitle: chatboxConfig.pageTitle,
                    token: chatboxConfig.token
                });
            });
            chatboxSocket.registerCallback('found same page', function (data) {
                console.log('found same page');
                if (chatboxConfig.samePageChat) return;
                if (_this.countDown != 0) return; // already counting down
                _this.countDownType = 'SITE_TO_PAGE';
                if (_this.state.display == 'full') {
                    _this.countDown = COUNT_DOWN;
                } else {
                    // faster but not instant, if instant, there's bug reporting online users
                    _this.countDown = 1;
                }
                _this.countDownRedirection();
            });
            chatboxSocket.registerCallback('disconnect', function (data) {
                chatboxSocket.state.connected = false;
                chatboxUtils.updateExtensionBadge();
            });
            chatboxSocket.registerCallback('name changed', function (data) {
                var log = {
                    isLog: true,
                    message: data.oldName+' '+_this.$t('m.changeNameTo')+' '+data.username
                };
                _this.messages.push(log);
                _this.scrollToBottomLater();
            });
            chatboxSocket.registerCallback('typing', function (data) {
                _this.addTypingUser(data.username);
            });
            chatboxSocket.registerCallback('stop typing', function (data) {
                // console.log('remove typing ' + data.username)
                _this.removeTypingUser(data.username);
            });
            // Whenever the server emits 'new message', update the chat body
            chatboxSocket.registerCallback('new message', function (data) {
                _this.processMsg(data);
                if (chatboxConfig.livechatDanmu && chatboxConfig.tabVisible) {
                    chatboxUtils.queueDanmu(data, 'live');
                }
                _this.saveMsgToStorage(data);
            });
            // Received file
            chatboxSocket.registerCallback('base64 file', function (data) {
                data.isFile = true;
                _this.processMsg(data);
            });
            chatboxSocket.registerCallback('alert', function (data) {
                Vue.notify({
                  title: _this.$t(data.errorCode),
                  type: 'error'
                });
            });
            chatboxSocket.registerCallback('admin message', function (msg) {
                Vue.notify({
                    title: msg,
                    type: 'success'
                });
            });
        },
        addIntro: function () {
            var emptyLog = {isLog: true, message:''};
            this.messages.push(emptyLog);
            var msg = this.$t('m.liveChatWelcomeLog');
            if (!chatboxConfig.samePageChat) {
                msg = this.$t('m.liveChatWelcomeLogSameSite');
            }
            var log = {
                isLog: true,
                message: msg
            };
            this.messages.push(log);
        },
        toggleConnection: function () {
            if (this.socket.state.connected) {
                chatboxConfig.liveChatEnabled = false;
                this.socket.disconnect();
            } else {
                this.startConnection();
            }
        },
        startConnection: function () {
            chatboxConfig.liveChatEnabled = true;
            chatboxSocket.connect();
            Vue.notify({
              title: this.$t('m.connecting'),
              type: 'warn'
            });
        },
        checkChatHistory: function () {
            var _this = this;
            chatboxUtils.storage.get(chatboxConfig.location, function(item) {
                if (item && item[chatboxConfig.location]) {
                    var messages = JSON.parse(item[chatboxConfig.location]);
                    _this.curPageChatHistory = messages;
                }
            });
            chatboxUtils.storage.get(chatboxConfig.domain, function(item) {
                if (item && item[chatboxConfig.domain]) {
                    var messages = JSON.parse(item[chatboxConfig.domain]);
                    _this.curSiteChatHisotry = messages;
                }
            });
        },
        loadChatHistory: function () {
            this.canLoadChatHistory = false;
            // load chat history from storage
            this.loadedHistory = 'PAGE';
            var history = this.curPageChatHistory;
            if (!chatboxConfig.samePageChat) {
                this.loadedHistory = 'SITE';
                history = this.curSiteChatHisotry;
            }
            this.historyMessages = [];
            var i = 0;
            for (; i< history.length; i++)
                this.processMsg(history[i], true);
            var log = {
                isLog: true,
                message: this.$t('m.chatHistoryAbove')
            };
            this.historyMessages.push(log);
        },
        hasScrolledToBottom: function () {
            return this.$refs.chatArea.scrollHeight - this.$refs.chatArea.scrollTop - this.$refs.chatArea.offsetHeight < 50
        }
    },
    watch: {
        'config.token': function (newToken, prevToken) {
            var _this = this;
            if (newToken && !chatboxSocket.isConnected()) {
                var liveChatEnabled = false;
                if (chatboxConfig.redirected) {
                    chatboxConfig.samePageChat = true;
                    liveChatEnabled = true;
                }
                // There is a bug below, if user click on disconnect
                // chatboxConfig.liveChatEnabled will be false
                // and login shouldn't trigger chat connection
                // but the whitelist code could still make connection
                if (liveChatEnabled || chatboxConfig.liveChatEnabled) {
                    this.startConnection();
                } else {
                    chatboxUtils.storage.get('whitelist', function (item) {
                        var whitelist = item['whitelist'];
                        if (whitelist && chatboxConfig.domain in whitelist) {
                            _this.startConnection();
                        }
                    });
                }
            }
            // If token changed to null, it's when auth failure or
            // user log out, should disconnect
            // Any chance we don't want to auto disconnect?
            if (chatboxSocket.isConnected() && !newToken) {
                chatboxSocket.disconnect();
            }
        },
        'config.samePageChat': function (newVal, prevVal) {
            this.loadedHistory = null;
            this.historyMessages = [];
            this.lastHistoryMsg = {};
        },
        'state.view': function (newView, prevView) {
            if (newView == 2) {
                if (this.hasScrolledToBottom()) {
                    chatboxConfig.unreadLiveMsgTotal = 0;
                }
            }
        },
        'state.display': function (newView, prevView) {
            if (newView == 'full') {
                if (firstTimeAutoScroll || chatboxConfig.unreadLiveMsgTotal) {
                    this.scrollToBottomLater();
                    firstTimeAutoScroll = false;
                }
                if ( this.state.view == 2) {
                    if (this.hasScrolledToBottom()) {
                        chatboxConfig.unreadLiveMsgTotal = 0;
                    }
                }
            }
        },
        'socket.state.connected': function (newState, prevState) {
            // once connected, show users in the same room
            // This is blocking view, deprecated
            // if (newState) {
            //     this.state.chatTopPanel = 1;
            // }
            if (!newState) {
                window.parent.postMessage({userCount: -1, samePage: false}, "*");
            }
        }
    },
    mounted () {
        var _this = this;
        $(this.$refs.chatArea).scroll(function(){
            if (_this.$refs.chatArea.scrollHeight - _this.$refs.chatArea.scrollTop - _this.$refs.chatArea.offsetHeight < 50) {
                chatboxConfig.unreadLiveMsgTotal = 0;
            }
        });
    },
    created () {
        var _this = this;
        chatboxUtils.registerTabInvisibleCallbacks(function () {
            if (!chatboxSocket.isConnected()) return;
            disconnectTimer = setTimeout(function(){
                chatboxSocket.disconnect();
                console.log('Disconnected socket after invisible for a long time');
            }, DISCONNECT_DELAY_TIME)
        });
        chatboxUtils.registerTabVisibleCallbacks(function () {
            if (disconnectTimer) {
                clearTimeout(disconnectTimer);
            }
            if(chatboxConfig.liveChatEnabled && !chatboxSocket.state.connected) {
                chatboxSocket.connect();
                Vue.notify({
                  title: _this.$t('m.connecting'),
                  type: 'warn'
                });
            }

            chatboxUtils.storage.get('chatbox_config', function (item) {
                // what other config do we need to reload?
                var configData = item['chatbox_config'] || {};
                if ('livechat_danmu' in configData) {
                    chatboxConfig.livechatDanmu = configData['livechat_danmu'];
                }
            });
        });

        // Check if page has changed url or title
        window.addEventListener("message", function(e){
            if (!e || !e.data) return
            if(e.data.locationUpdate) {
                chatboxConfig.pageTitle=e.data.title;
                var url = e.data.url;
                if (chatboxConfig.location != url) {
                    console.log('Location changed from ' + chatboxConfig.location+
                        ' to '+ url);
                    chatboxConfig.location = url;
                    // Different scenarios:
                    // 1. user is connected to site chat, no need to reconnect
                    // just report the new url
                    // 2. user is connected to page chat, count down to get confirmation
                    // to join new same page chat room
                    // 3. user is stubborn, no prompt, no need to report new url

                    if (chatboxSocket.isConnected) {
                        if (chatboxConfig.samePageChat) {

                            if (_this.countDown != 0) return; // already counting down
                            if (_this.state.display == 'full') {
                                _this.countDown = COUNT_DOWN;
                            } else {
                                // faster but not instant, if instant, there's bug reporting online users
                                _this.countDown = 1;
                            }
                            _this.countDownType = 'URL_CHANGE';
                            _this.countDownRedirection();
                        } else {
                            chatboxSocket.getSocket().emit('url changed', {url: url});
                        }
                    }
                }
            }
            // danmu clicked
            if(e.data.type == 'chat') {
                _this.state.view = 2;
                _this.state.chatTopPanel = 0;
                _this.scrollToBottom();
            }
            if(e.data.type == 'invitation') {
                _this.state.view = 2;
                _this.state.chatTopPanel = 2;
            }

        }, false);

        this.registerSocketEvents();
        if (chatboxConfig.testing)
            this.loadTestData();
        this.keepUpdatingLogTime();
        this.checkChatHistory();
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
