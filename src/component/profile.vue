<template>
    <div v-show="state.view==0">
        <div class="socketchatbox-page-title">
            <span>{{title}}</span>
        </div>
        <div class="socketchatbox-profileArea">

        </div>

    <button  @click="viewUser" class="socketchatbox-bottom-btn-wrapper">
        <span>Save!</span>
    </button>

    </div>
</template>
<style>

.socketchatbox-profileArea {
  width: 100%;
  height: calc(100% - 30px);
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
    name: 'profile-body',
    data () {
        return {
            state: chatboxUIState,
            chatbox: chatboxConfig,
            title: titleStr,
        }
    },
    methods: {
        viewUser: function (msg) {
            chatboxUtils.goToMessage(msg.user_id, msg.name);
        }
    },
    created () {
    }
}

</script>
