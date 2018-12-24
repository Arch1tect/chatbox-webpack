<template>
    <transition name="online-users-slide">
        <center v-if="state.chatTopPanel == 1 && socket.state.connected" class="socketchatbox-onlineusers">
            <center class="invite-people-btn" :class="{alone: onlineUsers.length==1}" @click="sendInvitation()">{{$t('m.invite')}}</center>
            <!--
                <center v-if="!config.samePageChat" class="same-page-chat-title" >{{$t('m.sameSiteChatTitle')}}</center>
            -->
            <span class="onlineUser" v-for="user in onlineUsers" @click="viewUser(user)"><center><img v-bind:title="user.username" v-bind:src="user.profileImgSrc" /></center></span>
        </center>
    <transition name="slide">
</template>
<style>
.online-users-slide-leave-active,
.online-users-slide-enter-active {
  transition: 1s;
}
.online-users-slide-enter {
  transform: translate(100%, 0);
}
.online-users-slide-leave-to {
  transform: translate(100%, 0);
}
.socketchatbox-onlineusers {
    background: #fff;
    width: 100%;
    overflow-y: auto;
    max-height: 50%;
    position: absolute;
    z-index: 1;
    /*padding-bottom: 5px;*/
    /*padding-top: 5px;*/
    outline: 1px solid #d3d3d3;
}
.socketchatbox-onlineusers .onlineUser {
    margin: 5px;
/*    margin-bottom: 0px;
*/    display: inline-block;
    cursor: pointer;
}
.onlineUser img {
    width: 30px;
    height: 30px;
    object-fit: cover;
    border-radius: 100%;
    box-shadow: 0 0 6px black;
    /*margin-bottom: 5px;*/
}
.invite-people-btn {
    cursor: pointer;
    color: gray;
    margin: 5px;
}
.same-page-chat-title {
    margin: 5px;
}
.invite-people-btn.alone {
    color: #06a5f1;
}
.invite-people-btn:hover {
    color: #03A9F4;
    text-decoration: underline;
}

</style>
<script>
import Vue from 'vue'

import chatboxConfig from '../config.js'
import chatboxUtils from '../utils.js'
import chatboxSocket from '../socket.js'

export default {
    name: 'online-users',
    data () {
        return {
            config: chatboxConfig,
            state: chatboxUIState,
            socket: chatboxSocket,
            onlineUsers: []
        }
    },
    methods: {
        viewUser: function (user) {
            chatboxUtils.viewOthersProfile(this.state.view, user.userId, user.username);
        },
        sendInvitation: function () {
            if (!chatboxConfig.samePageChat) {
                chatboxConfig.samePageChat = true;
                chatboxSocket.reconnect();
            }
            chatboxUtils.sendInvitation();
        },
        setOnlineUsers: function (onlineUsers) {
            var i = 0;
            for (; i < onlineUsers.length; i++) {
                var user = onlineUsers[i];
                chatboxUtils.tryLoadingProfileImg(user, user.userId, user.userId==chatboxConfig.userId);
            }
            this.onlineUsers = onlineUsers;
            chatboxSocket.userCount = this.onlineUsers.length;
            this.updateExtensionBadge();
        },
        updateExtensionBadge: function () {
            if (!this.config.tabVisible) return;
            if (chrome && chrome.browserAction) {
                if (chatboxConfig.unreadDirectMsg > 0) {
                    chrome.browserAction.setBadgeText({text: 'mail'});
                    chrome.browserAction.setBadgeBackgroundColor({color: "orange"});
                } else if (chatboxSocket.isConnected()){
                    chrome.browserAction.setBadgeText({text: this.onlineUsers.length+''});
                    chrome.browserAction.setBadgeBackgroundColor({color: "#0099ff"});
                } else {
                    chrome.browserAction.setBadgeText({text: ''});
                }
            }
        },
        registerSocketEvents: function () {
            var _this = this;
            chatboxSocket.registerCallback('user joined', function (data) {
              // console.log('user joined');
              chatboxSocket.state.connected = true;
              _this.setOnlineUsers(data.onlineUsers);

            });
            chatboxSocket.registerCallback('user left', function (data) {
                // console.log('user left');
                _this.setOnlineUsers(data.onlineUsers);
            });
            chatboxSocket.registerCallback('name changed', function (data) {
                _this.setOnlineUsers(data.onlineUsers);
            });
        }

    },
    created () {
        this.registerSocketEvents();
        chatboxUtils.updateExtensionBadge = this.updateExtensionBadge;
        chatboxUtils.registerTabVisibleCallbacks(this.updateExtensionBadge);
    }
}
</script>
