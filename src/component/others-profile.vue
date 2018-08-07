<template>
    <div v-show="state.view==-1">
        <div class="socketchatbox-page-title">
            <span>{{title}}</span>
        </div>
        <div class="socketchatbox-profileArea">
            <center>
                <img id="profile-img" v-bind:src="profileImgSrc" @error="useDefaultImg" />

                <input class="username" placeholder="Display name" type="text" v-model="username">
                <textarea v-model="aboutMe" placeholder="Introduce yourself here..." id="socketchatbox-aboutme"></textarea>
            </center>
        </div>

    <button  @click="message" class="socketchatbox-bottom-btn-wrapper">
        <span>Message</span>
    </button>

    </div>
</template>
<style>

</style>
<script>
import Vue from 'vue'

import chatboxUIState from '../ui-state.js'
import chatboxConfig from '../config.js'
import chatboxUtils from '../utils.js'


"use strict";
const DEFAULT_IMG_SRC = 'profile-empty.png';
var titleStr = 'Profile';
export default {
    name: 'other-profile',
    data () {
        return {
            state: chatboxUIState,
            chatbox: chatboxConfig,
            title: titleStr,
            profileImgSrc: DEFAULT_IMG_SRC,
            aboutMe: '',
            user_id: '',
            username: 'No name',

        }
    },
    methods: {
        message () {
            chatboxUtils.goToMessage(this.user_id, this.username);
        },
        useDefaultImg () {
            this.profileImgSrc = 'profile-empty.png';
        },
        tryLoadingProfileImg () {
            var src = chatboxConfig.s3Url+this.user_id+'.jpg';
            var _this = this;
            $("<img/>").on('load', function() {
                _this.profileImgSrc = src;
             }).on('error', function() {
                // no profile image
            }).attr("src", src);
        },
        viewOthersProfile (user_id, username) {
            this.state.view = -1;
            this.useDefaultImg();
            this.username = username;
            this.user_id = user_id
            this.title = username + "'s profile";
            this.tryLoadingProfileImg();
        }
    },
    created () {
        chatboxUtils.viewOthersProfile = this.viewOthersProfile;
    }
}

</script>
