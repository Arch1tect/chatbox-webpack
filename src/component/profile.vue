<template>
    <div v-show="state.view==0" class="socketchatbox-profile">
        <div class="socketchatbox-page-title">
            <span>{{title}}</span>
        </div>
        <div class="socketchatbox-profileArea">

        </div>
    </div>
</template>
<style>

.socketchatbox-commentsArea {
  overflow-wrap: break-word;
  width: 100%;
  height: calc(100% - 30px);
  overflow-y: auto; /*only show scroll bar when needs to*/
  border: none; 
  padding-right: 10px;
  padding-left: 10px;
  padding-top: 30px;
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
