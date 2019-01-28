<style>
.socketchatbox-aboutme-others {
    margin: 30px;
    margin-top: 20px;
    margin-bottom: 50px;
    text-align: left;
    line-height: 1.5;
}
.socketchatbox-bottom-btn-wrapper.red:hover {
    background: red;
}
.socketchatbox-bottom-btn-wrapper.half {
    width: 50%;
}
.socketchatbox-bottom-btn-wrapper.right-half {
    border-left: 1px solid lightgray;
}
.leave-others-profile {
    cursor: pointer;
    display: block;
    margin-top: -3px;
    font-size: 18px;
    position: absolute;
    color: gray;
    margin-left: 5px;
}
.user-metadata .follow {
    margin: 15px;
}
.block-user {
    color: red;
    cursor: pointer;
}
.block-user:hover {
    text-decoration: underline;
}
</style>
<template>
    <div v-show="state.view==-1">
        <div class="socketchatbox-page-title">
            <span class="leave-others-profile"><font-awesome-icon icon="long-arrow-alt-left" v-on:click='state.view=prevView' /></span><span>{{title}}</span>
        </div>
        <div class="socketchatbox-profileArea">
            <center>
                <img v-bind:src="profileImgSrc" />
                <div class="username">{{username}}</div>
                <div class="user-metadata"><span>ID: {{id}}</span><span class="follow">{{$t('m.followerCount')}}: {{followerCount}}</span></div>
                <div class="socketchatbox-aboutme">{{aboutMe}}</div>
                <br/><br/>
                <div @click="toggleBlockUser" class="block-user">{{toggleBlockUserStr}}</div>
                <br/><br/><br/>
            </center>
        </div>
        <button @click="toggleFollow" class="socketchatbox-bottom-btn-wrapper half" v-bind:class="{red: isFollowing}">
            <span>{{toggleFollowStr}}</span>
        </button>
        <button  @click="message" class="socketchatbox-bottom-btn-wrapper half right-half">
            <span>{{$t('m.sendPrivateMessage')}}</span>
        </button>
    </div>
</template>
<script>
import Vue from 'vue'

import chatboxUIState from '../ui-state.js'
import chatboxConfig from '../config.js'
import chatboxUtils from '../utils.js'


"use strict";
var titleStr = 'Profile';
export default {
    name: 'other-profile',
    data () {
        return {
            state: chatboxUIState,
            chatbox: chatboxConfig,
            title: titleStr,
            profileImgSrc: 'profile-empty.png',
            aboutMe: '',
            userId: '',
            id: '',
            joinDate: null,
            username: 'No name',
            prevView: 1,
            isFollowing: false,
            followerCount: null

        }
    },
    computed: {
        toggleFollowStr: function () {
            if (this.isFollowing)
                return this.$t('m.unfollow');
            return this.$t('m.follow');
        },
        toggleBlockUserStr: function () {
            if (this.userId in chatboxConfig.blockUserDict)
                return this.$t('m.unblock');
            return this.$t('m.block');
        }
    },
    methods: {
        toggleBlockUser () {
            var _this = this;
            // TODO: block PM as well

            // block chat socket by adding user to blacklist
            var msg = _this.toggleBlockUserStr + ' ' + this.$t('m.success');
            chatboxUtils.toggleBlockUserDict(this.userId);
            Vue.notify({
                title: msg
            });
            // TODO: notify server?
        },
        message () {
            chatboxUtils.goToMessage(this.userId, this.username, this.hasAvatar);
        },
        loadUserInfoFromDB () {
            var _this = this;
            $.get(chatbox.apiUrl + "/db/user/" + this.userId).done(function(resp) {
                if (!resp.length) {
                    Vue.notify({
                        title: _this.$t('e.userNotFound'),
                        type: 'error'
                    });
                    return;
                }
                var user = resp[0];
                _this.id = user.id;
                _this.username = user.name;
                _this.aboutMe = user.about;
                _this.joinDate = user.create_time;
                _this.followerCount = user.followers.length;
                _this.isFollowing = false;
                _this.hasAvatar = user.has_avatar;
                chatboxUtils.tryLoadingProfileImg(_this, _this.userId, false);
                user.followers.forEach(function (follower) {
                    if (follower.user_id == chatboxConfig.userId) {
                        _this.isFollowing = true;
                    }
                })
                _this.title = _this.$t('m.othersProfile', {username: user.name});
            }).fail(function (xhr, status, error) {
                var msg =  _this.$t('m.userLoadFailed');
                if (xhr.status !== 401) {
                    Vue.notify({
                        title: msg,
                        type: 'error'
                    });
                }
            }).always(function(){
            });
        },
        toggleFollow () {
            var _this = this;
            var payload = {
                user_id: this.userId,
                follower_id: chatboxConfig.userId,
                active: !this.isFollowing
            }
            Vue.notify({
                title: _this.$t('m.submitting'),
                type: 'warn'
            });
            $.post(chatbox.apiUrl + "/db/follow", payload).done(function(resp) {
                _this.isFollowing = !_this.isFollowing;
                if (_this.isFollowing) {
                    _this.followerCount ++;
                } else {
                    _this.followerCount --;
                }
                chatboxUtils.changeFollowing(_this.isFollowing, _this.userId, _this.username);
                Vue.notify({
                    title: _this.$t('m.success'),
                });
            }).fail(function (xhr, status, error) {
                var msg =  _this.$t('m.failed');
                if (xhr.status !== 401) {
                    Vue.notify({
                        title: msg,
                        type: 'error'
                    });
                }
            }).always(function(){
            });
        },
        viewOthersProfile (view, userId, username, hasAvatar) {
            // User may clicked on their own msg
            if (userId == chatboxConfig.userId) {
                this.state.view = 0;
                return;
            }
            this.prevView = view;
            this.state.view = -1;
            this.username = username;
            this.userId = userId;
            this.id = '';
            this.followerCount = null;
            this.aboutMe = '';
            if (hasAvatar) {
                chatboxUtils.tryLoadingProfileImg(this, userId, false)
            } else {
                this.profileImgSrc = 'profile-empty.png';
            }
            this.title = this.$t('m.othersProfile', {username: username});
            this.loadUserInfoFromDB();
        }
    },
    created () {
        var _this = this;
        chatboxUtils.viewOthersProfile = this.viewOthersProfile;
        chatboxUtils.addBlockUserChangeListener(function(data){
            chatboxConfig.blockUserDict = data;
        })
        chatboxUtils.getBlockUserDict(function(data){
            chatboxConfig.blockUserDict = data;
        })

    }
}

</script>
