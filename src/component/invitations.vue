<template>
    <transition name="slide">
        <div v-if="state.chatTopPanel == 2" class="socketchatbox-invites">
            <center v-if="firstLoad">{{$t('m.loading')}}</center>
            <center v-if="messages.length==0">{{$t('m.noInvitation')}}</center>
            <div class="invite-row" :class="{'self-invitation': msg.userId == config.userId}" v-for="msg in messages">
                <img @click="viewUser(msg.userId, msg.username)" v-bind:title="msg.username" v-bind:src="msg.profileImgSrc" />
                <span class="lobby-msg-content">{{$t('m.joinMe')}} <span class="page-title" @click="redirect(msg.url)" v-bind:title="msg.pageTitle"> {{msg.pageTitle}}</span>
                </span>
            </div>
        </div>
    </transition>
</template>
<style>
.slide-leave-active,
.slide-enter-active {
  transition: 1s;
}
.slide-enter {
  transform: translate(-100%, 0);
}
.slide-leave-to {
  transform: translate(-100%, 0);
}
.self-invitation {
    background: yellow;
}
.socketchatbox-invites {
    background: #fff;
    width: 100%;
    overflow-y: auto;
    padding: 10px;
    max-height: 50%;
    position: absolute;
    z-index: 1;
    outline: 1px solid #d3d3d3;
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
    /*text-decoration: none;*/
    color: #03A9F4;
}

.invite-row .page-title {
    cursor: pointer;
    margin-left: 2px;
    color: #03A9F4;
}


</style>
<script>
import Vue from 'vue'

import chatboxConfig from '../config.js'
import chatboxUtils from '../utils.js'
import chatboxSocket from '../socket.js'
var POLL_INTERVAL = 15;
export default {
    name: 'lobby',
    data () {
        return {
            config: chatboxConfig,
            state: chatboxUIState,
            firstLoad: true,
            messages: []
        }
    },
    methods: {
        viewUser: function (userId, username) {
            chatboxUtils.viewOthersProfile(this.state.view, userId, username);
        },
        redirect: function (url) {

            Vue.notify({
              title: this.$t('m.redirecting'),
              type: 'warn'
            });
            var data = {};
            data[url] = true;
            chatboxUtils.storage.get('chatbox_config', function(item) {
                var configData = item['chatbox_config'] || {};
                configData['tmp_allow'] = data;
                chatboxUtils.storage.set('chatbox_config', configData);
            })
            window.parent.postMessage({chatboxRedirect: url}, "*");
        },
        pollInvitation: function () {
            var _this = this;
            $.get(chatboxConfig.socketUrl + "/api/invitations", function(data) {
                var i=0;
                for(; i<data.length; i++) {
                    chatboxUtils.tryLoadingProfileImg(data[i], data[i].userId);
                }
                _this.messages = data.reverse();
            }).fail(function(){}).always(function(){});
        },
        keepPollingInvitations: function () {
            var _this = this;
            if (this.firstLoad||(chatboxConfig.tabVisible && this.state.display == "full" && this.state.view == 2 && this.state.chatTopPanel == 2)) {
                this.firstLoad = false;
                this.pollInvitation();
            }
            setTimeout(function(){
                _this.keepPollingInvitations();
            }, POLL_INTERVAL*1000);
        },
    },
    created () {
        chatboxUtils.pollInvitation = this.pollInvitation;
        // this.messages.push(msg);
        this.keepPollingInvitations();
    }
}
</script>
