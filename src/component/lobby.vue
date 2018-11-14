<template>
    <div v-show="state.chatTopPanel == 2" class="socketchatbox-lobby">
        <div v-for="msg in messages"><img @click="viewUser(msg.user)" v-bind:title="msg.user.username" v-bind:src="msg.user.profileImgSrc" /><span class="lobby-msg-content">{{msg.content}}</span></div>

    </div>
</template>
<style>
.socketchatbox-lobby {
    background: #fff;
    width: 100%;
    overflow-y: auto;
    padding: 10px;
    max-height: 50%;
    position: absolute;
    z-index: 1;
    border-bottom: 1px solid #d3d3d3;
}
.socketchatbox-lobby img {
    cursor: pointer;
    width: 30px;
    height: 30px;
    object-fit: cover;
    float: left;
    border-radius: 100%;
    box-shadow: 0 0 6px black;
    margin-right: 10px;
}
.lobby-msg-content {
    cursor: pointer;
    line-height: 30px;
}
.lobby-msg-content:hover {
    color: #03A9F4;
}
</style>
<script>
import Vue from 'vue'

import chatboxConfig from '../config.js'
import chatboxUtils from '../utils.js'
import chatboxSocket from '../socket.js'

export default {
    name: 'lobby',
    data () {
        return {
            config: chatboxConfig,
            state: chatboxUIState,
            messages: []
        }
    },
    methods: {
        viewUser: function (user) {
            chatboxUtils.viewOthersProfile(this.state.view, user.userId, user.username);
        },

    },
    created () {
        var user = {
            username: 'David'
        };
        chatboxUtils.tryLoadingProfileImg(user, '38cd89e3-0fde-724a-6149-1b5d74c42cfc');
        var msg = {
            user: user,
            content: 'Join me at Lord of Ring | Youtube'
        }
        this.messages.push(msg);

    }
}
</script>
