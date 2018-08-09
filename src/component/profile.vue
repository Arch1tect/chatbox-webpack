<template>
    <div v-show="state.view==0">
        <div class="socketchatbox-page-title">
            <span>{{title}}</span>
        </div>
        <div class="socketchatbox-profileArea">
            <center>
                <img v-bind:src="profileImgSrc" onerror="this.onerror=null;this.src='profile-empty.png';" />

                <div class="upload-profile-image-btn-wrapper">
                  <button class="upload-profile-image">Upload profile picture</button>
                  <input type="file" @change="onFileChanged">
                </div>

                
                <input class="username" placeholder="Display name" type="text" v-model="username">
                <textarea v-model="aboutMe" placeholder="Introduce yourself here..." id="socketchatbox-aboutme"></textarea>
            </center>
        </div>

    <button :disabled="disableSave" @click="save" class="socketchatbox-bottom-btn-wrapper">
        <span>{{saveStr}}</span>
    </button>

    </div>
</template>
<style>
.upload-profile-image-btn-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
  margin-top: 5px;
}

.upload-profile-image {
    border: 1px solid lightgray;
    background-color: white;
    border-radius: 5px;
    background: #00a1ff;
    padding: 8px;
    color: white;
    cursor: pointer;

}

.upload-profile-image-btn-wrapper input[type=file] {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0;
}
button:disabled, button[disabled]{
  background-color: #cccccc;
  color: black;
  cursor: not-allowed !important;
}
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
    /*margin-bottom: 10px;*/
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

var titleStr = 'Your profile';
export default {
    name: 'profile-body',
    data () {
        return {
            state: chatboxUIState,
            chatbox: chatboxConfig,
            profileImgSrc: 'profile-empty.png',
            imgFile: null,
            aboutMe: '',
            username: 'No name',
            savingName: false,
            savingImg: false
        }
    },
    computed: {
        title: function () {
            return this.chatbox.username+"'s profile";
        },
        saveStr: function () {
            if (this.savingName || this.savingImg)
                return 'Saving...';
            else
                return 'Save';
        },
        disableSave: function () {
            return this.username == this.chatbox.username &&
            !this.imgFile || this.savingName || this.savingImg;
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
            if (this.username == this.chatbox.username) {
                return;
            }
            this.savingName = true;
            this.chatbox.username = this.username;
            chatboxUtils.storage.set('username', this.username);
            var payload = {
                'uuid': chatboxConfig.userId,
                'name': this.username
            }
            var _this = this;
            $.post(chatboxConfig.apiUrl + "/db/user/change_name", payload, function(resp) {
                Vue.notify({
                  title: 'Name saved!',
                });
            }).fail(function () {
                Vue.notify({
                  title: 'Failed to save name',
                  type: 'error'
                });
            }).always(function(){
                _this.savingName = false;
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
                _this.imgFile = null;
                Vue.notify({
                  title: 'Profile image saved!',
                });
            }).fail(function () {
                Vue.notify({
                  title: 'Failed to save profile image',
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
            if (item['username']) {
                _this.username = item['username'];
            }
        });
        this.profileImgSrc = chatboxConfig.s3Url+chatboxConfig.userId+'.jpg?rand='+Math.random();
    }
}

</script>
