<template>
    <div v-show="state.view==0">
        <div class="socketchatbox-page-title">
            <span>{{title}}</span>
        </div>
        <div class="socketchatbox-profileArea">
            <center>
                <div class="img-upload-file-wrapper">
                    <img v-bind:src="profileImgSrc" onerror="this.onerror=null;this.src='profile-empty.png';" />

                    <div class="upload-profile-image-btn-wrapper">
                      <button class="upload-profile-image-btn">Upload profile picture</button>
                      <input accept="image/*" type="file" @change="onFileChanged">
                    </div>
                </div>

                
                <input class="username" placeholder="Display name" maxlength="10" type="text" v-model="username">
                <textarea v-model="aboutMe" placeholder="Introduce yourself here..." class="socketchatbox-aboutme"></textarea>
            </center>
        </div>

    <button :disabled="!canSave" @click="save" class="socketchatbox-bottom-btn-wrapper">
        <span>{{saveStr}}</span>
    </button>

    </div>
</template>
<style>
.img-upload-file-wrapper:hover .upload-profile-image-btn-wrapper {
    visibility: visible;
}
.upload-profile-image-btn-wrapper {
    visibility: hidden;
    position: relative;
    margin-top: -52px;
    cursor: pointer !important;
    font-size: large;
}

.upload-profile-image-btn {
    border: none;
    width: 100%;
    height: 50px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: large;
}
.upload-profile-image-btn-wrapper:hover .upload-profile-image-btn{
    background: rgba(0, 0, 0, 0.75);
}

.upload-profile-image-btn-wrapper input[type=file] {
    position: absolute;
    cursor: pointer;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0;
}
button:disabled, button[disabled]{
  background-color: lightgray !important;
  color: black !important;
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
.socketchatbox-aboutme {
    padding: 5px;
    width:80%;
    height: 100px;
    resize: none;
    background: none;
    border: 1px solid lightgray;
    border-radius: 5px;
    margin-bottom: 30px;
    text-align: left;
    line-height: 1.5;
}
.socketchatbox-aboutme:focus {
    outline: none;
}
.socketchatbox-profileArea .username {
    margin: 0px;
    margin-top: 15px;
    margin-bottom: 25px;
    padding: 5px;
    text-align: center;
    font-size: 15px;
    width: 150px;
    border: none;
    border-bottom: 1px solid lightgray;
}
input.username {
    background: none;
    /* border-radius: 3px; */
    display: block;
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
import chatboxSocket from '../socket.js'


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
            savingImg: false,
            savingAboutMe: false
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
        canSave: function () {
            var saving = this.savingName || this.savingImg;
            if (saving) return false;
            var profileImgUpdated = this.imgFile;
            var nameUpdated = this.username !== this.chatbox.username;
            var aboutUpdated = this.aboutMe !== chatboxConfig.aboutMe;

            return profileImgUpdated || nameUpdated || aboutUpdated;
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
            chatboxSocket.getSocket().emit('change name', {username: this.username});
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
        saveAboutMe () {
            if (this.aboutMe == this.chatbox.aboutMe) {
                return;
            }
            this.savingAboutMe = true;
            this.chatbox.aboutMe = this.aboutMe;
            chatboxUtils.storage.set('about-me', this.aboutMe);
            var payload = {
                'uuid': chatboxConfig.userId,
                'aboutMe': this.aboutMe
            }
            var _this = this;
            $.post(chatboxConfig.apiUrl + "/db/user/change_about_me", payload, function(resp) {
                Vue.notify({
                  title: 'Introduction saved!',
                });
            }).fail(function () {
                Vue.notify({
                  title: 'Failed to save introduction',
                  type: 'error'
                });
            }).always(function(){
                _this.savingAboutMe = false;
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
            this.saveAboutMe();
        },
        init () {
            // TODO: Had to write below duplicate code to ensure user id has been loaded from local storage
            if (chatboxConfig.userId && chatboxConfig.username) {
                this.username = chatboxConfig.username;
                chatboxUtils.tryLoadingProfileImg(this, chatboxConfig.userId);
            } else {
                var _this = this;
                setTimeout(function(){
                    _this.init();
                }, 100);
            }
        }
    },
    created () {
        this.init();
        var _this = this;
        chatboxUtils.storage.get('about-me', function(item){
            _this.aboutMe = item['about-me'];
            chatboxConfig.aboutMe = _this.aboutMe;
        })
    }
}

</script>
