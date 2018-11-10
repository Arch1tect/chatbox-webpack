<template>
    <center v-show="state.showOnlineUsers && socket.state.connected" class="socketchatbox-onlineusers">
        <span class="onlineUser" v-for="user in onlineUsers" @click="viewUser(user)"><center><img v-bind:title="user.username" v-bind:src="user.profileImgSrc" /></center></span>
        <center v-if="onlineUsers.length==0">No user on this page</center>
    </center>
</template>
<style>
.socketchatbox-onlineusers {
    background: #fff;
    width: 100%;
    overflow-y: auto;
    max-height: 50%;
    position: absolute;
    z-index: 1;
    padding-bottom: 5px;
    padding-top: 5px;
    border-bottom: 1px solid #d3d3d3;
}

/* Handle */
.onlineUsersWrapper ::-webkit-scrollbar-thumb {
    /*background: #0189fe ; */
}

.socketchatbox-onlineusers .onlineUser {
    margin: 5px;
/*    margin-bottom: 0px;
*/    display: inline-block;
    cursor: pointer;
}

.onlineUser img {
    width: 25px;
    height: 25px;
    object-fit: cover;
    border-radius: 100%;
    box-shadow: 0 0 6px black;
    /*margin-bottom: 5px;*/
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
        setOnlineUsers: function (onlineUsers) {
            var i = 0;
            for (; i < onlineUsers.length; i++) {
                var user = onlineUsers[i];
                chatboxUtils.tryLoadingProfileImg(user, user.userId);
            }
            this.onlineUsers = onlineUsers;
            chatboxSocket.userCount = this.onlineUsers.length;
        },
        registerSocketEvents: function () {
            var _this = this;
            chatboxSocket.registerCallback('user joined', function (data) {
              console.log('user joined');
              chatboxSocket.state.connected = true;
              _this.setOnlineUsers(data.onlineUsers);

            });
            chatboxSocket.registerCallback('user left', function (data) {
                console.log('user left');
                _this.setOnlineUsers(data.onlineUsers);
            });
            chatboxSocket.registerCallback('name changed', function (data) {
                _this.setOnlineUsers(data.onlineUsers);
            });
        }

    },
    created () {
        this.registerSocketEvents();
    }
}
</script>
