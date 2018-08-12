<template>
    <div v-show="state.view==-1">
        <div class="socketchatbox-page-title">
            <span class="leave-others-profile"><font-awesome-icon icon="long-arrow-alt-left" v-on:click='state.view=prevView' /></span><span>{{title}}</span>
        </div>
        <div class="socketchatbox-profileArea">
            <center>
                <img v-bind:src="profileImgSrc" />
                <div class="username">{{username}}</div>
                <div class="socketchatbox-aboutme-others"></div>
            </center>
        </div>

    <button  @click="message" class="socketchatbox-bottom-btn-wrapper">
        <span>Message</span>
    </button>

    </div>
</template>
<style>
.leave-others-profile {
    display: block;
    margin-top: -3px;
    font-size: 18px;
    position: absolute;
    color: gray;
    margin-left: 5px;
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
            user_id: '',
            username: 'No name',
            prevView: 1

        }
    },
    methods: {
        message () {
            chatboxUtils.goToMessage(this.user_id, this.username);
        },
        viewOthersProfile (view, user_id, username) {
            // User may clicked on their own msg
            if (user_id == chatboxConfig.userId) {
                this.state.view = 0;
                return;
            }
            this.prevView = view;
            this.state.view = -1;
            this.username = username;
            this.user_id = user_id
            this.title = username + "'s profile";
            chatboxUtils.tryLoadingProfileImg(this, user_id);
        }
    },
    created () {
        chatboxUtils.viewOthersProfile = this.viewOthersProfile;
    }
}

</script>
