<template>
    <div v-show="state.chatTopPanel == 2" class="socketchatbox-invites">
        <!-- <center>Invitations</center> -->
        <div class="invite-row" v-for="msg in messages"><img @click="viewUser(msg.userId)" v-bind:title="msg.username" v-bind:src="msg.profileImgSrc" />
            <span class="lobby-msg-content">Join me at <a target="_blank" v-bind:href="msg.url" v-bind:title="msg.pageTitle">{{msg.pageTitle}}</a>
            </span>
        </div>
    </div>
</template>
<style>
.socketchatbox-invites {
    background: #fff;
    width: 100%;
    overflow-y: auto;
    padding: 10px;
    max-height: 50%;
    position: absolute;
    z-index: 1;
    border-bottom: 1px solid #d3d3d3;
}
.invite-row {
    padding: 3px;
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis;
}
.socketchatbox-invites img {
    cursor: pointer;
    width: 20px;
    height: 20px;
    object-fit: cover;
    float: left;
    border-radius: 100%;
    box-shadow: 0 0 6px black;
    margin-right: 10px;
}
.lobby-msg-content {
    /*cursor: pointer;*/
    line-height: 20px;
}
/*.lobby-msg-content:hover {
    color: #03A9F4;
}*/

.invite-row a, .invite-row a:visited{
    text-decoration: none;
    color: #03A9F4;
}


</style>
<script>
import Vue from 'vue'

import chatboxConfig from '../config.js'
import chatboxUtils from '../utils.js'
import chatboxSocket from '../socket.js'
var POLL_INTERVAL = 5;
var firstLoad = true;
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
        pollInvitation: function () {
            var _this = this;
            $.get(chatboxConfig.socketUrl + "/api/invitations", function(data) {
                console.log(data);
                var i=0;
                for(; i<data.length; i++) {
                    chatboxUtils.tryLoadingProfileImg(data[i], data[i].userId);
                }
                _this.messages = data.reverse();
            }).fail(function(){}).always(function(){});
        },
        keepPollingInvitations: function () {
            var _this = this;
            if (firstLoad||(chatboxConfig.tabVisible && this.state.display == "full" && this.state.view == 2 && this.state.chatTopPanel == 2)) {
                firstLoad = false;
                this.pollInvitation();
            }
            setTimeout(function(){
                _this.keepPollingInvitations();
            }, POLL_INTERVAL*1000);
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
        // this.messages.push(msg);
        this.keepPollingInvitations();
    }
}
</script>
