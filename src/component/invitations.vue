<template>
    <transition name="slide">
        <div v-if="state.chatTopPanel == 2" class="socketchatbox-invites">
            <center v-if="socket.state.connected" class="invite-people-btn-wrapper">{{$t('m.invite')}}&nbsp;
                <span :title="costStr(0)" @click="sendInvitation('FOLLOWER_INVITE')">{{$t('m.followers')}}</span>
                |&nbsp;<span :title="costStr(1)" @click="sendInvitation('SAME_SITE_INVITE')">{{$t('m.sameSitePeople')}}</span>
                |&nbsp;<span :title="costStr(10)" @click="sendInvitation('GLOBAL_INVITE')">{{$t('m.everybody')}}</span>
            </center>
            <!--<center v-show="Object.keys(invitations).length==0">{{$t('m.noInvitation')}}</center>-->
            <div class="invite-row" :class="{'self-invitation': msg.userId == config.userId}" v-for="msg in invitations">
                <img @click="viewUser(msg.userId, msg.username, msg.hasAvatar)" v-bind:title="msg.username" v-bind:src="msg.profileImgSrc" />
                <span class="lobby-msg-content">{{$t('m.joinMe')}} <span class="page-title" @click="redirect(msg.url)" v-bind:title="msg.pageTitle"> {{msg.pageTitle}}</span>
                </span>
            </div>
        </div>
    </transition>
</template>
<style>


.invite-people-btn-wrapper {
    color: gray;
    margin-top: 10px;
    margin-bottom: 10px;
}
.invite-people-btn-wrapper span {
    cursor: pointer;
    /*margin-left: 2px;*/
    /*color: #03A9F4;*/
    color: black;
    -webkit-user-select: none;  /* Chrome all / Safari all */
    -moz-user-select: none;     /* Firefox all */
    -ms-user-select: none;      /* IE 10+ */
    user-select: none;
}
.invite-people-btn-wrapper span:hover {
    text-decoration: underline;
}
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
    padding: 5px;
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
export default {
    name: 'lobby',
    data () {
        return {
            config: chatboxConfig,
            state: chatboxUIState,
            socket: chatboxSocket,
            invitations: {}
        }
    },
    methods: {
        sendInvitation: function (type) {
            if (!chatboxConfig.samePageChat) {
                chatboxConfig.samePageChat = true;
                chatboxSocket.reconnect();
            }
            var _this = this;
            if (!chatboxConfig.pageTitle||!chatboxSocket.isConnected()) {
                // wait for page title from content.js
                // wait for socket connection
                console.log('no page title or not connected yet...');
                setTimeout(function () {
                    _this.sendInvitation(type);
                }, 1000);
                return;
            }
            chatboxSocket.getSocket().emit('invite', {
                version: chatboxConfig.version,
                pageTitle: chatboxConfig.pageTitle,
                type: type
            });
            Vue.notify({
                title: _this.$t('m.sendingInvitation'),
                type: 'warn'
            });
        },
        costStr: function (x) {
            return this.$t('m.cost') + ' ' +x+ ' ' + this.$t('m.credit');
        },
        viewUser: function (userId, username, hasAvatar) {
            chatboxUtils.viewOthersProfile(this.state.view, userId, username, hasAvatar);
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
                if (chatboxConfig.tabVisible) {
                    _this.queueDanmu(msg);
                }
            });
            chatboxSocket.registerCallback('invitation_sent', function (data) {
                var msg = _this.$t('m.invitationSent');
                // Think: privacy issue?
                if (data && data.receiverCount) {
                    msg += ', ' + data.receiverCount + _this.$t('m.numUserReceived');
                }
                Vue.notify({
                    title: msg,
                });
            });
            // server no longer send expire event since v2.4.0
            chatboxSocket.registerCallback('invitation expired', function (msg) {
                Vue.delete(_this.invitations, msg.url);
            });
        },
        processInvitation: function (msg) {
            // Either realtime invitation from socket event
            // or bulk get from API poll
            Vue.set(this.invitations, msg.url, msg);
            if (msg.userId == chatboxConfig.userId) {
                msg.me = true;
            }
            chatboxUtils.tryLoadingProfileImg(msg, msg.userId, msg.me);

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
        loadTestData: function () {
            var msg = {
                'userId': '1c5422f7-2164-b84d-59bc-180060392825',
                'username': '杰伦',
                'pageTitle': '双节棍MV | Youtube',
                'url': 'e'
            }
            this.processInvitation(msg);
            chatboxUtils.queueDanmu(msg, 'invitation');
            msg = {
                'userId': '1c5422f7-2164-b84d-59bc-180060392825',
                'username': '发哥',
                'pageTitle': '上海滩 | 优酷娱乐',
                'url': 'd'
            }
            this.processInvitation(msg);
            chatboxUtils.queueDanmu(msg, 'invitation');
            msg = {
                'userId': '1c5422f7-2164-b84d-59bc-180060392825',
                'username': '肥猫',
                'pageTitle': '哥布林杀手 | Bilibili',
                'url': 'c'
            }
            this.processInvitation(msg);
            chatboxUtils.queueDanmu(msg, 'invitation');
            msg = {
                'userId': '1c5422f7-2164-b84d-59bc-180060392825',
                'username': 'David',
                'pageTitle': '刀剑神域第三季第1集 | Bilibili',
                'url': 'b'
            }
            this.processInvitation(msg);
            chatboxUtils.queueDanmu(msg, 'invitation');
            msg = {
                'userId': chatboxConfig.userId,
                'username': '燕姿',
                'pageTitle': '绿光 | Youtube',
                'url': 'a'
            }
            this.processInvitation(msg);
            chatboxUtils.queueDanmu(msg, 'invitation');
        }
    },
    created () {
        this.registerInvitationCallback();

        chatboxUtils.registerTabVisibleCallbacks(function(){
            chatboxUtils.storage.get('chatbox_config', function (item) {
                // what other config do we need to reload?
                var configData = item['chatbox_config'] || {};
                if ('invitation_danmu' in configData) {
                    chatboxConfig.invitationDanmu = configData['invitation_danmu'];
                }
            });
        })

        if (chatboxConfig.testing) this.loadTestData();
    }
}
</script>
