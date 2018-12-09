<template>
    <transition name="slide">
        <div v-if="state.chatTopPanel == 2" class="socketchatbox-invites">
            <center class='loading-invitations' v-show="config.firstLoadInvitation">{{$t('m.loading')}}</center>
            <center v-show="messages.length==0">{{$t('m.noInvitation')}}</center>
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
.loading-invitations {
    margin-bottom: 10px;
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
var POLL_INTERVAL = 7;
export default {
    name: 'lobby',
    data () {
        return {
            config: chatboxConfig,
            state: chatboxUIState,
            invitationUrls: {},
            selfAdded: false,
            messages: []
        }
    },
    methods: {
        viewUser: function (userId, username) {
            chatboxUtils.viewOthersProfile(this.state.view, userId, username);
        },
        redirect: function (url) {
            var data = {};
            data[url] = true;
            chatboxUtils.storage.get('chatbox_config', function(item) {
                var configData = item['chatbox_config'] || {};
                configData['redirect'] = data;
                chatboxUtils.storage.set('chatbox_config', configData);
            })
            window.open(url, '_blank');
            // window.parent.postMessage({chatboxRedirect: url}, "*"); // same page redirect is bad, browse history changed and can't go back to previous page
            // Vue.notify({
            //   title: this.$t('m.redirecting'),
            //   type: 'warn'
            // });
        },
        pollInvitation: function () {
            var _this = this;
            $.get(chatboxConfig.socketUrl + "/api/invitations", function(data) {
                var i=0;
                _this.selfAdded = false;
                var invitationUrlsNew = {};
                for(; i<data.length; i++) {
                    var msg = data[i];
                    if (msg.userId == chatboxConfig.userId) {
                        _this.selfAdded = true;
                        msg.me = true;
                    }
                    invitationUrlsNew[msg.url] = true;
                    _this.queueDanmu(msg);
                    chatboxUtils.tryLoadingProfileImg(msg, msg.userId);
                }
                _this.invitationUrls = invitationUrlsNew;
                _this.messages = data.reverse();
                chatboxConfig.firstLoadInvitation = false;
            }).fail(function(){}).always(function(){});

        },
        queueDanmu: function (msg) {
            var notFirstLoad = !chatboxConfig.firstLoadInvitation;
            var notAlreadySeen = !(msg.url in this.invitationUrls);
            var allowDanmu = false;
            if (chatboxConfig.invitationDanmu == 'any_site') {
                allowDanmu = true;
            } else if (chatboxConfig.invitationDanmu == 'same_site') {
                allowDanmu = chatboxUtils.extractRootDomain(chatboxConfig.location) == chatboxUtils.extractRootDomain(msg.url);
            }
            if (allowDanmu && notFirstLoad && notAlreadySeen) {
                chatboxUtils.queueDanmu(msg, 'invitation');
            }
        },
        addSelfToInvitation: function () {
            // there's a delay before user's own invitation is returned, manually put it there
            if (this.selfAdded) return;
            var msg = {
                'userId': chatboxConfig.userId,
                'username': chatboxConfig.username,
                'pageTitle': chatboxConfig.pageTitle,
                'url': chatboxConfig.location

            }
            chatboxUtils.tryLoadingProfileImg(msg, msg.userId);
            this.messages.unshift(msg);
            this.selfAdded = true;

        },
        keepPollingInvitations: function () {
            var _this = this;
            // if (chatboxConfig.firstLoadInvitation||(chatboxConfig.tabVisible && this.state.display == "full" && this.state.view == 2 && this.state.chatTopPanel == 2)) {
            if (chatboxConfig.firstLoadInvitation||chatboxConfig.tabVisible) {
                this.pollInvitation();
            }
            setTimeout(function(){
                _this.keepPollingInvitations();
            }, POLL_INTERVAL*1000);
        },
        loadTestData: function () {
            var msg = {
                'userId': '1c5422f7-2164-b84d-59bc-180060392825',
                'username': '杰伦',
                'pageTitle': '双节棍MV | Youtube',
                'url': chatboxConfig.location
            }
            chatboxUtils.queueDanmu(msg, 'invitation');
            msg = {
                'userId': '1c5422f7-2164-b84d-59bc-180060392825',
                'username': '发哥',
                'pageTitle': '上海滩 | 优酷娱乐',
                'url': chatboxConfig.location
            }
            chatboxUtils.queueDanmu(msg, 'invitation');
            msg = {
                'userId': '1c5422f7-2164-b84d-59bc-180060392825',
                'username': '肥猫',
                'pageTitle': '哥布林杀手 | Bilibili',
                'url': chatboxConfig.location
            }
            chatboxUtils.queueDanmu(msg, 'invitation');
            msg = {
                'userId': '1c5422f7-2164-b84d-59bc-180060392825',
                'username': 'David',
                'pageTitle': '刀剑神域第三季第1集 | Bilibili',
                'url': chatboxConfig.location
            }
            chatboxUtils.queueDanmu(msg, 'invitation');
            msg = {
                'userId': '1c5422f7-2164-b84d-59bc-180060392825',
                'username': '燕姿',
                'pageTitle': '绿光 | Youtube',
                'url': chatboxConfig.location
            }
            chatboxUtils.queueDanmu(msg, 'invitation');
        }
    },
    created () {
        chatboxUtils.addSelfToInvitation = this.addSelfToInvitation;
        this.keepPollingInvitations();
        if (chatboxConfig.testing) this.loadTestData();
    }
}
</script>
