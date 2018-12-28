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
</style>
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
            profileImgSrc: '',
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
    },
    methods: {
        message () {
            chatboxUtils.goToMessage(this.userId, this.username);
        },
        loadUserInfoFromDB () {
            var _this = this;
            $.get(chatbox.apiUrl + "/db/user/" + this.userId).done(function(resp) {
                if (!resp.length) {
                    Vue.notify({
                        title: _this.$t('m.userNotFound'),
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
                user.followers.forEach(function (follower) {
                    if (follower.user_id == chatboxConfig.userId) {
                        _this.isFollowing = true;
                    }
                })
                _this.title = _this.$t('m.othersProfile', {username: user.name});

            }).fail(function() {
                Vue.notify({
                    title: _this.$t('m.userLoadFailed'),
                    type: 'error'
                });
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
                Vue.notify({
                    title: _this.$t('m.success'),
                });
            }).fail(function() {
                Vue.notify({
                    title: _this.$t('m.failed'),
                    type: 'error'
                });
            }).always(function(){
            });
        },
        viewOthersProfile (view, userId, username) {
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
            this.aboutMe = '';
            this.title = this.$t('m.othersProfile', {username: username});
            chatboxUtils.tryLoadingProfileImg(this, userId);
            this.loadUserInfoFromDB();
        }
    },
    created () {
        chatboxUtils.viewOthersProfile = this.viewOthersProfile;
    }
}

</script>
