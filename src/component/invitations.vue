<template>
    <transition name="slide">
        <div v-if="state.chatTopPanel == 2" class="socketchatbox-invites">
            <center class='loading-invitations' v-show="loadingInvitations">{{$t('m.loading')}}</center>
            <center v-show="Object.keys(invitations).length==0">{{$t('m.noInvitation')}}</center>
            <div class="invite-row" :class="{'self-invitation': msg.userId == config.userId}" v-for="msg in invitations">
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
var POLL_INTERVAL = 20;
export default {
    name: 'lobby',
    data () {
        return {
            config: chatboxConfig,
            state: chatboxUIState,
            loadingInvitations: true,
            invitations: {}
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
        },
        registerInvitationCallback: function () {
            var _this = this;
            chatboxSocket.registerCallback('invite', function (msg) {
                _this.processInvitation(msg);
                _this.queueDanmu(msg);
            });
        },
        processInvitation: function (msg) {
            // Either realtime invitation from socket event
            // or bulk get from API poll
            Vue.set(this.invitations, msg.url, msg);
            chatboxUtils.tryLoadingProfileImg(msg, msg.userId);
            if (msg.userId == chatboxConfig.userId) {
                msg.me = true;
            }
        },
        pollInvitations: function () {
            var _this = this;
            $.get(chatboxConfig.socketUrl + "/api/invitations", function(data) {
                var invitationsNew = {}
                data.forEach(function(msg) {
                    var showDanmu = !(msg.url in _this.invitations);
                    _this.processInvitation(msg);
                    invitationsNew[msg.url] = msg;
                    // TODO: invitation might already seen in other tab, use localStorage to sync between tabs?
                    // if (showDanmu) _this.queueDanmu(msg);
                })
                _this.invitations = invitationsNew;
            }).fail(function(){}).always(function(){
                _this.loadingInvitations = false;
            });

        },
        queueDanmu: function (msg) {
            var allowDanmu = false;
            if (chatboxConfig.invitationDanmu == 'any_site') {
                allowDanmu = true;
            } else if (chatboxConfig.invitationDanmu == 'same_site') {
                allowDanmu = chatboxUtils.extractRootDomain(chatboxConfig.location) == chatboxUtils.extractRootDomain(msg.url);
            }
            if (allowDanmu) {
                chatboxUtils.queueDanmu(msg, 'invitation');
            }
        },
        keepPollingInvitations: function () {
            var _this = this;
            // Should poll from API if not connected to socket
            // and tab is visible
            setTimeout(function(){
                var shouldPoll = chatboxConfig.tabVisible && !chatboxSocket.isConnected();
                if (shouldPoll) {
                    _this.pollInvitations();
                }
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
        this.registerInvitationCallback();
        this.pollInvitations();
        this.keepPollingInvitations();
        if (chatboxConfig.testing) this.loadTestData();
    }
}
</script>
