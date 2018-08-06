<template>
    <div v-show="state.view==0">
        <div class="socketchatbox-page-title">
            <span>{{title}}</span>
        </div>
        <div class="socketchatbox-profileArea">
            <center>
                <img src="http://www.swaves.com/Back_Issues/Dec04/AvrilCover2.gif" />
                <input class="username" type="text" v-model="username">
                <textarea v-model="aboutMe" placeholder="Introduce yourself here..." id="socketchatbox-aboutme"></textarea>
            </center>
        </div>

    <button  @click="viewUser" class="socketchatbox-bottom-btn-wrapper">
        <span>Save</span>
    </button>

    </div>
</template>
<style>
.socketchatbox-profileArea {
    width: 100%;
    height: calc(100% - 30px);
    /*padding-top: 20px;*/
    /*background: #3bbeff;*/
    /*background: white;*/
    overflow-y: auto;
    overflow-x: hidden;

}
#socketchatbox-aboutme {
    padding: 5px;
    width:80%;
    height: 100px;
    resize: none;
        background: none;

    border: 1px solid lightgray;
    border-radius: 5px;
    margin-bottom: 30px;
}
input.username {
    border: none;
    background: none;
    border-bottom: 1px solid lightgray;
    /* border-radius: 3px; */
    display: block;
    margin: 0px;
    margin-top: 15px;
    margin-bottom: 25px;
    padding: 5px;
    /* width: 80%; */
    text-align: center;
    font-size: 15px;
}
input.username:focus{
    outline: none;
}
.socketchatbox-profileArea img {
    width: 100%;
    /*border: 5px solid white;*/
    /*border-radius: 10px;*/
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
            aboutMe: '',
            username: 'No name'
        }
    },
    methods: {
        viewUser: function (msg) {
            chatboxUtils.goToMessage(msg.user_id, msg.name);
        }
    },
    created () {
        this.username = chatboxConfig.username;
    }
}

</script>
