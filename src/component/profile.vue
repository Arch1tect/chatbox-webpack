<template>
    <div v-show="state.view==0">
        <div class="socketchatbox-page-title">
            <span>{{title}}</span>
        </div>
        <div class="socketchatbox-profileArea">
            <center>
                <img v-bind:src="profileImgSrc" onerror="this.onerror=null;this.src='profile-empty.png';" />
                <input type="file" @change="onFileChanged">
                <input class="username" placeholder="Display name" type="text" v-model="username">
                <textarea v-model="aboutMe" placeholder="Introduce yourself here..." id="socketchatbox-aboutme"></textarea>
            </center>
        </div>

    <button  @click="save" class="socketchatbox-bottom-btn-wrapper">
        <span>{{saveStr}}</span>
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
#socketchatbox-aboutme:focus {
    outline: none;
}
input.username {
    border: none;
    background: none;
    border-bottom: 1px solid lightgray;
    /* border-radius: 3px; */
    display: block;
    margin: 0px;
    /*margin-top: 15px;*/
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
    margin-bottom: 10px;
    /*min-height: 250px;*/
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
            profileImgSrc: 'profile-empty.png',
            imgFile: null,
            aboutMe: '',
            username: 'No name',
            savingName: false,
            savingImg: false
        }
    },
    computed: {
        saveStr: function () {
            if (this.savingName || this.savingImg)
                return 'Saving...';
            else
                return 'Save';
        }
    },
    methods: {
        onFileChanged (event) {
            var file = event.target.files[0];
            if (!file) {
                this.imgFile = null;
                return;
            }
            this.imgFile = new FormData();
            var _this = this;

            // TODO: only allow 1 file
            $.each(event.target.files, function(key, value)
            {
                _this.imgFile.append('img', value);
            });
            var reader = new FileReader();
            reader.onload = function (e) {
                _this.profileImgSrc = e.target.result;
            };
            reader.readAsDataURL(file);
        },
        saveName () {
            this.savingName = true;
            this.chatbox.username = this.username;
            chatboxUtils.storage.set('username', this.username);
            var payload = {
                'uuid': chatboxConfig.userId,
                'name': this.username
            }
            var _this = this;
            $.post(chatboxConfig.apiUrl + "/db/user/change_name", payload, function(resp) {
                _this.savingName = false;
                Vue.notify({
                  title: 'Name saved!',
                });
            });
        },
        saveProfileImg () {
            if (!this.imgFile) return;
            this.savingImg = true;
            var _this = this;
            $.ajax({
                type: "POST",
                url: chatboxConfig.apiUrl + "/user/change_profile_img/"+chatboxConfig.userId,
                data: _this.imgFile,
                enctype: 'multipart/form-data',
                processData: false,  // Important!
                contentType: false,
                cache: false,
                timeout: 10*1000 // TODO: put this everywhere, no, put it in base class
            }).done(function () {
                Vue.notify({
                  title: 'Profile image saved!',
                });
            }).fail(function () {
                Vue.notify({
                  title: 'Fail to save profile image',
                  type: 'error'
                });
            }).always(function(){
                _this.savingImg = false;
            });
        },
        save () {
            this.saveName();
            this.saveProfileImg();
        }
    },
    created () {
        // Can't rely on chatboxConfig because chatboxConfig
        // hasn't loaded from storage, need to read from storage instead
        this.username = chatboxConfig.username;
        var _this = this;
        chatboxUtils.storage.get('username', function (item) {
            if (item['username'])
                _this.username = item['username'];
        });
        this.profileImgSrc = chatboxConfig.s3Url+chatboxConfig.userId+'.jpg';
    }
}

</script>
