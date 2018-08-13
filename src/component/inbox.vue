<template>
    <div class="socketchatbox-inbox" v-show="state.view==3">
        <div class="socketchatbox-page-title">
            <font-awesome-icon icon="sync-alt" v-bind:class="{fa: true, 'fa-refresh': true, 'fa-spin': loading }" @click="userClickRefresh" title='Refresh' data-toggle="tooltip" data-placement="bottom" id='socketchatbox-refresh-inbox' />
            <span>Conversation with <a @click="viewProfile" href='#'>{{selectedFriend.name}}</a></span>
        </div>
        <div class="socketchatbox-inbox-wrapper">
            <span class="fa fa-chevron-left" id="socketchatbox-toggle-friend-list"></span>
            <div class="socketchatbox-friend-list">
                <center v-bind:class="{friendnameWrapper: true, selected: friend.selected}" @click="selectFriend(friend)" v-for="friend in friends"><span class='message-unread' v-show='friend.unreadMsg'></span><img v-bind:src="friend.profileImgSrc" /><div class="name-text">{{friend.name}}</div></center>
            </div>
            <div ref="msgArea" class="socketchatbox-friend-messages">
                <div class="inbox-conversation-no-message" v-if="!selectedConversation.length">Start the conversation now!</div>
                <div v-bind:class="{ 'socketchatbox-message socketchatbox-inbox-message': true, 'socketchatbox-message-me': msg.me, 'merge-above': false }" v-for="msg in selectedConversation">
                    <div v-if="msg.isLog" class="socketchatbox-log">{{msg.message}}</div>
                    <div v-else>
                        <div v-if="msg.renderType=='media'" class="socketchatbox-messageBody image-or-video"><img class="chatbox-image" v-bind:src="msg.message" /></div>
                        <!-- use v-html because message contain html due to adding class to emoji -->
                        <div v-if="msg.renderType=='text'" v-html="msg.message" class="socketchatbox-messageBody"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.socketchatbox-page-title a {
    color: black;
    text-decoration: underline;
}
.socketchatbox-inbox-wrapper {
    /*background: #f4f5ff;*/
  height: calc(100% - 30px);
  width: 100%;
}
.socketchatbox-inbox {
  width: 100%;
  height: 100%;
  background: #eceff1;
}
.socketchatbox-inbox-message {
  width: 100%;
  display: inline-block;
  margin-bottom: 0px;
}
.inbox-conversation-no-message {
  position: relative;
  top: 45%;
  text-align: center;
  color: gray;
    font-size: 15px;
    font-weight: bold;
}
.socketchatbox-friend-messages {
  height: 100%;
  padding: 10px;
  overflow-y: auto;
  overflow-x: hidden;
}
.socketchatbox-friend-list {
  width: 25%;
  height: 100%;
  overflow: auto;
  float: left;
  background: rgba(0, 0, 0, 0.75);
  /*border-right: 1px solid lightgray;*/
  color: white;
}
.socketchatbox-friend-list img {
    width: 32px;
    height: 32px;
    object-fit: cover;
    border-radius: 100%;
    box-shadow: 0 0 6px black;

}

.friendnameWrapper .name-text {
    /* margin: 10px; */
    text-align: center;
    margin-top: 3px;
}

/*.friendnameWrapper:hover {
    background-color: #ffffff;
    cursor: pointer;
    color: black;
}*/
.socketchatbox-friend-list .message-unread {
border-radius: 50%;
    background: orange;
    height: 10px;
    /* position: absolute; */
    left: 5px;
    float: left;
    margin-right: -15px;
    margin-top: 10px;
    width: 10px;
    margin-left: 5px;
}
.friendnameWrapper {
    padding-top: 10px;
    padding-bottom: 5px;
    cursor: pointer;
}
.friendnameWrapper.selected {
    background-color: #eceff1;
    color: black;
}
#socketchatbox-toggle-friend-list {
  position: absolute;
  display: none;
  z-index: 2;
  top: 50%;
  left: 70px;
  padding: 10px;
  color: gray;
  cursor: pointer;
  background: white;
  outline: 1px solid lightgray;
}
#socketchatbox-toggle-friend-list:hover {
  color: black;
}
</style>
<script>
/*
message object:
{
    create_time: "2018-07-08 07:36:15",
    id: 0,
    message: "Welcome! Thank you!",
    receiver: 'fdafdsafd-adsfasdf-kl',
    receivername: "David",
    sender: 'chat-bot-id',
    sendername: 'chat bot'
}
friend object:
{
    name: 'chat bot',
    userId: 'chat-bot-id',
    selected: false,
}

Given friend user id, look up all their messages:
{
    'sfaf-hgfjhg-kljk': [message1, message2],
    'fafds-vbcvb-edffg': [message1, message2, message3]
    ...
}
*/
// TODO: need to messages and offset in local storage
import Vue from 'vue'
import * as moment from 'moment';

import chatboxUIState from '../ui-state.js'
import chatboxConfig from '../config.js'
import chatboxUtils from '../utils.js'


"use strict";
var LOG_MESSAGE_TIME_AFTER = 5*60*1000 // 5 mins
const POLL_INTERVAL = 7; // seconds
export default {
    name: 'inbox-body',
    data () {
        return {
            state: chatboxUIState,
            loading: false,
            messageDict: {},
            friendDict: {},
            selectedConversation: [],
            selectedFriend: null,
            chatbotFriend: null,
            friends: [],
            shouldAutoSelect: true,
            // track latest msg user received regardless of which friend it's from
            lastMsgId: -1
        }
    },
    methods: {
        viewProfile: function () {
            chatboxUtils.viewOthersProfile(3, this.selectedFriend.userId, this.selectedFriend.name);
        },
        buildFriendObj: function (id, inName) {
            var name = inName;
            if (!name)
                name = 'no name';
            var friend = {
                userId: id,
                profileImgSrc: '',
                name: name,
                selected: false,
                unreadMsg: true
            };
            chatboxUtils.tryLoadingProfileImg(friend, id);
            return friend;
        },
        selectFriend: function (friend) {
            if (friend.selected) {
                this.viewProfile();
                return;
            }
            var i=0;
            for (; i < this.friends.length; i++) {
                if (this.friends[i].selected)
                    this.friends[i].selected = false;
            }
            friend.selected = true;
            this.selectedFriend = friend;
            this.setReadFlag([friend], true);
        },
        loadChatbotMsg: function () {
            // chatbot welcoming message load without ajax call
            // set it as default selected friend so we don't
            // need to hide input bar
            var i = 0;
            for (; i < welcomeMessagesFromChatbot.length; i++) {
                this.chatbotFriend = this.processMsg(welcomeMessagesFromChatbot[i]);
            }
            this.selectFriend(this.chatbotFriend);
        },
        loadTestData: function () {
            var i = 0;
            for (; i<testData.length; i++) {
                var friend = this.processMsg(testData[i]);
                friend.unreadMsg = false;
            }
        },
        styleMsg: function (data) {
            if (data.message.match(/\.(jpeg|jpg|gif|png)$/) !== null) {
                data.renderType = 'media';
            } else {
                data.renderType = 'text';
                data.message = chatboxUtils.addClassToEmoji(data.message);
            }
        },
        moveFriendToTop: function (friend) {
            var index = this.friends.indexOf(friend);
            this.friends.splice(index, 1);
            this.friends.unshift(friend);
        },
        addFriend: function (friend) {
            this.friendDict[friend.userId] = friend;
            this.friends.unshift(friend);
            this.messageDict[friend.userId] = [];
        },
        processMsg: function (data) {
            this.styleMsg(data);
            // Some logic that based on conversation:
            // 1. log time if needed
            // 2. add friend if first message of conversation
            // 3. mark if message need to display friend's name - lastBySelf
            var friend = null;
            if (data.sender == chatboxConfig.userId) {
                data.me = true;
                friend = this.buildFriendObj(data.receiver, data.receivername);
            } else {
                friend = this.buildFriendObj(data.sender, data.sendername);
            }
            // Figure out if need to log time before pushing message itself
            var messageTime = moment.utc(data.create_time);
            var log = {
                isLog: true,
                message: messageTime.local().format("MMMM Do YYYY, h:mm a")
            };

            var conversation = this.messageDict[friend.userId];
            if (conversation) {
                var lastMsg = null;
                if (conversation.length)
                    lastMsg = conversation[conversation.length-1];
                // important: use existing friend obj in friendDict
                friend = this.friendDict[friend.userId];
                // determine if need to log time
                var curMsgTime = moment(data.create_time);
                if (!lastMsg || messageTime.diff(moment.utc(lastMsg.create_time))  > LOG_MESSAGE_TIME_AFTER) {
                    conversation.push(log);
                }
                conversation.push(data);

            } else {
                // first message of conversation that's sent FROM OTHER USER!
                data.firstMsg = true;
                this.addFriend(friend);
                this.messageDict[friend.userId] = [log, data];
            }
            return friend;
        },
        sendPM: function (msg) {
            var _this = this;
            var payload = {
                'sender': chatboxConfig.userId,
                'receiver': this.selectedFriend.userId,
                'message': msg
            }
            $.post(chatboxConfig.apiUrl + "/db/message", payload, function(resp) {
                _this.pollMsgFromDB();
            });
        },
        userClickRefresh: function () {
            this.pollMsgFromDB(true);
        },
        keepPolling: function () {
            var _this = this;
            _this.pollMsgFromDB();
            // Note that the code below doesn't care if the ajax
            // call finish or success or fail
            setTimeout(function(){
                _this.keepPolling();
            }, POLL_INTERVAL*1000);
        },
        saveMsgToLocal: function (data) {
            if (!data.length) return;
            // Todo: deep copy or create new simple data
            // since data may be modified when processing
            chatboxUtils.storage.get('chatbox-inbox', function (item) {
                var messages = [];
                if (item && item['chatbox-inbox']) {
                    messages = JSON.parse(item['chatbox-inbox']);
                }
                var lastMsgIdInStorage = -1;
                if (messages.length) {
                    lastMsgIdInStorage = messages[messages.length-1].id;
                }
                var i = 0;
                for (; i < data.length; i++) {
                    if (data[i].id > lastMsgIdInStorage) {
                        messages.push(data[i]);
                    }
                }
                chatboxUtils.storage.set('chatbox-inbox', JSON.stringify(messages));
            });
        },
        checkLocalMsgThenLongPollFromDB: function () {
            // Must read from local then poll DB to avoid duplicate
            // This is done by updating last msg id
            var _this = this;
            chatboxUtils.storage.get('chatbox-inbox',function(item) {
                if (item && item['chatbox-inbox']) {
                    var messages = JSON.parse(item['chatbox-inbox']);
                    _this.processMsgInBatch(messages);
                }
                _this.getReadFlags(function(alreadyReadFriends) {
                    var i = 0;
                    for (; i < _this.friends.length; i++) {
                        var friend = _this.friends[i];
                        if (friend.userId in alreadyReadFriends) {
                            friend.unreadMsg = false;
                            console.log('friend '+friend.userId+' aready read');
                        }
                    }
                });
                _this.keepPolling();
            });
        },
        processMsgInBatch: function (data, setAsUnread) {
            // Generic logic, used by real poll from DB
            // and reading from local storage
            // friend marked as unread.
            var i = 0;
            var friend = null;
            var friendsWhoSentMail = [];
            for (; i< data.length; i++) {
                this.lastMsgId = data[i].id;
                friend = this.processMsg(data[i]);
                if (data[i].sender !== chatboxConfig.userId) {
                    friendsWhoSentMail.push(friend);
                }
            }
            if (setAsUnread) {
                this.setReadFlag(friendsWhoSentMail, false);
            }
            // If first time polling msg, select the latest conversation, also move it to top 
            // TODO: we have only made sure the latest one conversation is on the top
            // Ideally entire friend list should be sorted by last conversation desc
            if (friend) {
                this.moveFriendToTop(friend);
                if (this.shouldAutoSelect) {
                    // delay the auto select to ensure set message unread is finished
                    var _this = this;
                    setTimeout(function(){
                        _this.selectFriend(friend);
                    }, 1000);
                }
            }
            return friend;
        },
        getReadFlags: function (callback) {
            chatboxUtils.storage.get('already-read-friends', function (item) {
                var alreadyReadFriends = {};
                if (item && item['already-read-friends']) {
                    alreadyReadFriends = JSON.parse(item['already-read-friends']);
                }
                callback(alreadyReadFriends);
            });
        },
        setReadFlag: function (friends, alreadyRead) {
            if (document.hidden) {
                return;
            }

            this.getReadFlags(function(alreadyReadFriends){
                var i = 0; 
                for (; i< friends.length; i++) {
                    var friend = friends[i];
                    friend.unreadMsg = !alreadyRead;

                    if (alreadyRead) {
                        alreadyReadFriends[friend.userId] = 1;
                    } else {
                        delete alreadyReadFriends[friend.userId];
                    }
                    chatboxUtils.storage.set('already-read-friends', JSON.stringify(alreadyReadFriends));
                }
            });
        },
        pollMsgFromDB: function (reportStatus) {
            // console.log('start polling from db');
            this.loading = true;
            var _this = this;
            $.get(chatboxConfig.apiUrl + "/db/message/offset/" + this.lastMsgId+"/user/" + chatboxConfig.userId, function(data) {
                _this.saveMsgToLocal(data);
                var lastConversationFriend = _this.processMsgInBatch(data, true);
                var newMsgFromOthersCount = 0;
                var i = 0;
                for (; i < data.length; i++) {
                    if (data[i].sender != chatboxConfig.userId) {
                        newMsgFromOthersCount ++;
                    }
                }
                var noty = "No new message";
                if (newMsgFromOthersCount) {
                    noty = 'Received '+ newMsgFromOthersCount + ' new message';
                }
                if (newMsgFromOthersCount||reportStatus) {
                    Vue.notify({
                        title: noty,
                    });
                }
            }).fail(function() {
                if (reportStatus) {
                    Vue.notify({
                      title: 'Failed to check new message',
                      type: 'error'
                    });
                }
            }).always(function(){
                _this.loading = false;
                // auto select only happens when chatbox just load
                // that includes loading from cache and first call to DB
                _this.shouldAutoSelect = false;
            });
        },
        scrollToBottom: function () {
            this.$refs.msgArea.scrollTop = this.$refs.msgArea.scrollHeight;
        },
        goToMessage: function (userId, username) {
            this.state.view = 3;
            var friend = null;
            if (userId in this.friendDict) {
                friend = this.friendDict[userId];
            } else {
                friend = this.buildFriendObj(userId, username);
                this.addFriend(friend);
                this.messageDict[userId] = [];
            }
            this.selectFriend(friend);
        }
    },
    watch: {
        selectedFriend: function (newSelected, prevSelected) {
            this.selectedConversation = this.messageDict[newSelected.userId];
        },
        selectedConversation: function (newVal, oldVal) {
            var _this = this;
            Vue.nextTick(function(){
                _this.scrollToBottom();
            });
        }
    },
    computed: {
        // below code deprecated, using notification box instead
        titleDeprecated: function () {}
    },
    created () {
        // expose sendPM method so input component can access it
        chatboxUtils.sendPM = this.sendPM;
        chatboxUtils.goToMessage = this.goToMessage;
        this.loadChatbotMsg();
        if (chatboxConfig.testing)
            this.loadTestData();
        this.checkLocalMsgThenLongPollFromDB();
    }
}
function sortByMsgId(a, b) {
    return a.id > b.id ? -1 : 1;
}
var welcomeBunnyGif = "stickers/bunny/hi.gif";

var welcomeMessagesFromChatbot = [
    {
        create_time: "2018-07-08 07:36:15",
        id: -1,
        message: welcomeBunnyGif,
        receiver: chatboxConfig.userId,
        receivername: "",
        sender: chatboxConfig.chatbot.userId,
        sendername: chatboxConfig.chatbot.name,
    },
    {
        create_time: "2018-07-08 07:36:15",
        id: 0,
        message: "Welcome! Thank you for using this app and please feel free to send us feedback! ;)",
        receiver: chatboxConfig.userId,
        receivername: "",
        sender: chatboxConfig.chatbot.userId,
        sendername: chatboxConfig.chatbot.name,
    },
]
var testData = [
    {
        create_time: "2018-07-08 07:36:15",
        id: 1,
        message: "😄😄😄 After the first talks since the Trump-Kim summit, Secretary of State Mike Pompeo insisted that Pyongyang is still negotiating in good faith, even as it condemned U.S. demands.",
        receiver: chatboxConfig.userId,
        receivername: "",
        sender: "10",
        sendername: "Sue",
    },
    {
        create_time: "2018-07-08 07:36:15",
        id: 2,
        message: "Secretary of State Mike Pompeo insisted that Pyongyang is still negotiating in good faith, even as it condemned U.S. demands.",
        receiver: chatboxConfig.userId,
        receivername: "",
        sender: "10",
        sendername: "Sue",
    },
    {
        create_time: "2018-07-08 07:36:15",
        id: 3,
        message: "Secretary of State Mike Pompeo insisted that Pyongyang is still negotiating in good faith, even as it condemned U.S. demands.",
        receiver: "10",
        receivername: "Sue",
        sender: chatboxConfig.userId,
        sendername: "",
    },
    {
        create_time: "2018-07-08 07:36:15",
        id: 4,
        message: "Secretary of State Mike Pompeo insisted that Pyongyang is still negotiating in good faith, even as it condemned U.S. demands.",
        receiver: chatboxConfig.userId,
        receivername: "",
        sender: "10",
        sendername: "Sue",
    },
    {
        create_time: "2018-07-08 07:36:15",
        id: 5,
        message: "After the 2016 Presidential election, the Trump Administration and the Republican-controlled Congress reduced U.S. support for climate-change-related research, causing the Centre’s program and similar initiatives around the world to scramble for funding. 😄😄😄 A U.S.A.I.D. official told me that American funding for the Centre’s project will end in 2019, instead of in 2020, because of a change in “the Administration’s foreign-policy and national-security priorities.”",
        receiver: chatboxConfig.userId,
        receivername: "",
        sender: "10",
        sendername: "Sue",
    }
]
</script>
