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
    .follower-stats {
        margin: 10px;
    }
    .show-change-password-form {
        margin: 30px;
        cursor: pointer;
        color: #00a6ff;
    }
    .show-change-password-form:hover {
        text-decoration: underline;
    }
    .follower-stats span{
        cursor: pointer;
    }
    .follower-stats .count{
        margin:0px;
        color: #00a6ff;
    }
    .follower-stats span:hover {
        text-decoration: underline;
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
    .socketchatbox-profileArea .user-metadata {
        color: gray;
        margin: 15px;
    }
    .user-metadata span {
        margin: 15px;
    }
    .socketchatbox-aboutme {
        padding: 5px;
        width:80%;
        min-height: 80px;
        word-break: break-all;
        resize: none;
        background: none;
        border: 1px solid lightgray;
        border-radius: 5px;
        /*margin-bottom: 30px;*/
        text-align: left;
        line-height: 1.5;
    }
    .socketchatbox-aboutme:focus {
        outline: none;
    }
    .socketchatbox-profileArea .username {
        margin: 0px;
        margin-top: 15px;
        /*margin-bottom: 25px;*/
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
        /*max-height: 200px;*/
        /*object-fit: cover;*/
    }
    .password-requiremnets {
        color: red;
    }
</style>
<template>
    <div v-show="state.view==0 && chatbox.token">
        <div class="socketchatbox-page-title">
            <span v-if="changingPassword" class="leave-others-profile"><font-awesome-icon icon="long-arrow-alt-left" @click='changingPassword=false' /></span>
            <span v-if="chatbox.token && !changingPassword">{{$t('m.selfProfile')}}</span>
            <span v-if="changingPassword">{{$t('m.showChangePasswordForm')}}</span>
        </div>
        <div ref="profileArea" class="socketchatbox-profileArea">
            <div v-if="chatbox.token">
                <center v-show="!changingPassword">
                    <div class="img-upload-file-wrapper">
                        <img v-bind:src="profileImgSrc" onerror="this.onerror=null;this.src='profile-empty.png';" />
                        <div class="upload-profile-image-btn-wrapper">
                          <button class="upload-profile-image-btn">{{$t('m.uploadProfileImage')}}</button>
                          <input accept="image/*" type="file" @change="onFileChanged">
                        </div>
                    </div>
                    <input class="username" :placeholder="$t('m.displayName')" maxlength="10" type="text" v-model="username">
                    <div class="user-metadata">
                        <div>
                            <span>ID: {{chatbox.userNumId}}</span>
                            <span>{{$t('m.credit')}}: {{chatbox.credit}}</span>
                        </div>
                        <div class="follower-stats">
                            <span @click="utils.viewFollowers(true, followings, followers)">{{$t('m.followingCount')}}: <span class="count">{{followings.length}}</span></span>
                            <span @click="utils.viewFollowers(false, followings, followers)">{{$t('m.followerCount')}}: <span class="count">{{followers.length}}</span></span>
                        </div>
                    </div>
                    <textarea v-model="aboutMe" :placeholder="$t('m.aboutMe')" class="socketchatbox-aboutme"></textarea>
                </center>
                <center v-if="!changingPassword" class='show-change-password-form' @click='toggleChangePasswordForm'>{{$t('m.showChangePasswordForm')}}</center>
                <div class="login-forms-wrapper" v-if="changingPassword">
                    <br/><br/><br/>
                    <span>{{$t('m.newPassword')}}</span>
                    <input ref="newPasswordInput" maxlength="20" type="password" v-model="newPassword">
                    <br/>
                    <span>{{$t('m.confirmPassword')}}</span>
                    <input maxlength="20" type="password" v-model="confirmNewPassword">
                    <br/>
                    <div class="password-requiremnets">{{newPasswordRequirements}}</div>
                </div>
            </div>
        </div>

        <button v-if="chatbox.token" :disabled="!canSave" @click="save" class="socketchatbox-bottom-btn-wrapper" v-bind:class="{half: !changingPassword}">
            <span>{{saveStr}}</span>
        </button>

        <button v-if="chatbox.token && !changingPassword" @click="logout" class="socketchatbox-bottom-btn-wrapper half right-half red">
            <span>{{$t('m.logout')}}</span>
        </button>

    </div>
</template>

<script>
import chatboxUIState from '../ui-state.js'
import chatboxConfig from '../config.js'
import chatboxUtils from '../utils.js'
import chatboxSocket from '../socket.js'


"use strict";

export default {
    name: 'profile-body',
    data () {
        return {
            utils: chatboxUtils,
            state: chatboxUIState,
            chatbox: chatboxConfig,
            profileImgSrc: 'profile-empty.png',
            hasAvatar: false,
            imgFile: null,
            aboutMe: '',
            username: 'No name',
            followers: [],
            followings: [],
            savingData: false,
            savingImg: false,
            changingPassword: false,
            newPassword: '',
            confirmNewPassword: ''
        }
    },
    computed: {
        saveStr: function () {
            if (this.savingData || this.savingImg)
                return this.$t('m.updating');
            else
                return this.$t('m.update');
        },
        canSave: function () {
            var saving = this.savingData || this.savingImg;
            if (saving) return false;
            var profileImgUpdated = this.imgFile;
            var nameUpdated = this.username !== this.chatbox.username;
            var aboutUpdated = this.aboutMe !== this.chatbox.aboutMe;
            var passwordUpdated = this.newPassword !='' && this.newPassword == this.confirmNewPassword;

            return profileImgUpdated || nameUpdated || aboutUpdated || passwordUpdated;
        },
        newPasswordRequirements: function () {
            if (this.newPassword.length>0 && this.newPassword.length < 8)
                return this.$t('e.passwordTooShort');
            if (this.newPassword != this.confirmNewPassword)
                return this.$t('e.passwordNotMatch');
        }
    },
    methods: {
        toggleChangePasswordForm () {
            var _this = this;
            if (this.changingPassword) {
                this.changingPassword = false;
            } else {
                this.changingPassword = true;
                Vue.nextTick(function() {
                    _this.$refs.newPasswordInput.focus();
                    //     _this.$refs.profileArea.scrollTop = _this.$refs.profileArea.scrollHeight;
                });
            }
        },
        onFileChanged (event) {
            var _this = this;
            var file = event.target.files[0];
            this.imgFile = null;
            if (!file) {
                return;
            }
            if (file.size > 1024*1024) {
                Vue.notify({
                    title: this.$t('m.avatarTooBig')+ ' 1MB',
                    type: 'error'
                });
                return
            }

            this.imgFile = new FormData();

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
            this.savingData = true;

            var payload = {
                'uuid': chatboxConfig.userId,
                'name': this.username
            }
            var _this = this;
            $.post(chatboxConfig.apiUrl + "/db/user/change_name", payload, function(resp) {
                Vue.notify({
                    title: _this.$t('m.nameUpdated'),
                });
                _this.chatbox.username = _this.username;
                chatboxUtils.storage.get('chatbox_config', function(item) {
                    var configData = item['chatbox_config']||{};
                    configData['username'] = _this.username;
                    chatboxUtils.storage.set('chatbox_config', configData);
                });
                if (chatboxSocket.state.connected) {
                    chatboxSocket.getSocket().emit('change name', {username: _this.username});
                }
            }).fail(function (xhr, status, error) {
                var msg =  _this.$t('m.nameUpdateFailed');
                if (xhr.status == 404) {
                    msg = _this.$t('e.userNotFound');
                }
                if (xhr.status !== 401) {
                    Vue.notify({
                        title: msg,
                        type: 'error'
                    });
                }
            }).always(function(){
                _this.savingData = false;
            });
        },
        saveNewPassword () {
            var passwordUpdated = this.newPassword !='' && this.newPassword == this.confirmNewPassword;

            if (!passwordUpdated) {
                return;
            }
            this.savingData = true;
            var payload = {
                'password': this.newPassword
            }
            var _this = this;
            $.post(chatboxConfig.apiUrl + "/db/user/change_password", payload, function(resp) {
                Vue.notify({
                    title: _this.$t('m.passwordUpdated'),
                });
                chatboxConfig.password = _this.newPassword;
                chatboxUtils.setBasicConfig({'password': _this.newPassword});
                _this.changingPassword = false;
                // TODO: also need to update this.password in login.vue
            }).fail(function (xhr, status, error) {
                var msg =  _this.$t('m.failed');
                if (xhr.status !== 401) {
                    Vue.notify({
                        title: msg,
                        type: 'error'
                    });
                }
            }).always(function(){
                _this.savingData = false;
            });
        },
        saveAboutMe () {
            if (this.aboutMe == this.chatbox.aboutMe) {
                return;
            }
            this.savingData = true;
            this.chatbox.aboutMe = this.aboutMe;
            var payload = {
                'uuid': chatboxConfig.userId,
                'aboutMe': this.aboutMe
            }
            var _this = this;
            $.post(chatboxConfig.apiUrl + "/db/user/change_about_me", payload, function(resp) {
                Vue.notify({
                  title: _this.$t('m.introductionUpdated'),
                });
                chatboxUtils.storage.get('chatbox_config', function (item) {
                    var configData = item['chatbox_config'] || {};
                    configData['about_me'] = _this.aboutMe;
                    chatboxUtils.storage.set('chatbox_config', configData);
                });
            }).fail(function (xhr, status, error) {
                var msg =  _this.$t('m.introductionUpdateFailed');
                if (xhr.status == 404) {
                    msg = _this.$t('e.userNotFound');
                }
                if (xhr.status !== 401) {
                    Vue.notify({
                        title: msg,
                        type: 'error'
                    });
                }
            }).always(function(){
                _this.savingData = false;
            });
        },
        saveProfileImg () {
            if (!this.imgFile) return;
            this.savingImg = true;
            var _this = this;
            $.ajax({
                type: "POST",
                url: chatboxConfig.apiUrl + "/db/user/change_profile_img_v2/"+chatboxConfig.userId,
                data: _this.imgFile,
                enctype: 'multipart/form-data',
                processData: false,  // Important!
                contentType: false,
                cache: false,
                timeout: 10*1000 // TODO: put this everywhere, no, put it in base class
            }).done(function () {
                _this.imgFile = null;
                Vue.notify({
                  title: _this.$t('m.profileImageUpdated'),
                });
            }).fail(function (xhr, status, error) {
                var msg =  _this.$t('m.profileImageUpdateFailed');
                if (xhr.status !== 401) {
                    Vue.notify({
                        title: msg,
                        type: 'error'
                    });
                }
            }).always(function(){
                _this.savingImg = false;
            });
        },
        save () {
            this.saveName();
            this.saveProfileImg();
            this.saveAboutMe();
            this.saveNewPassword();
        },
        loadUser () {
            // called when user profile tab is open
            if (this.hasAvatar) chatboxUtils.tryLoadingProfileImg(this, chatboxConfig.userId, true);

            var _this = this;
            $.get(chatboxConfig.apiUrl + "/db/user/" + chatboxConfig.userId).done(function(resp) {
                if (!resp.length) {
                    Vue.notify({
                        title: _this.$t('e.userNotFound'),
                        type: 'error'
                    });
                    return;
                }
                var user = resp[0];
                chatboxConfig.username = user.name;
                chatboxConfig.aboutMe = user.about;
                _this.aboutMe = user.about;
                _this.username = user.name;
                chatboxConfig.userNumId = user.id;
                chatboxConfig.credit = user.credit;
                _this.followers = user.followers || [];
                _this.followings = user.followings || [];
                // Question: what needs to be saved locally, what not?
                chatboxUtils.setBasicConfig({
                    username: user.name,
                    id: user.id,
                    about_me: user.about,
                    has_avatar: user.has_avatar
                });
                // For user's own avatar, check s3 rather than cdn
                _this.hasAvatar = user.has_avatar;
                chatboxUtils.tryLoadingProfileImg(_this, chatboxConfig.userId, true);

            }).fail(function (xhr, status, error) {
                var msg =  _this.$t('m.userLoadFailed');
                if (xhr.status !== 401) {
                    Vue.notify({
                        title: msg,
                        type: 'error'
                    });
                }
            }).always(function(){});

        },
        logout () {
            var _this = this;
            $.post(chatboxConfig.apiUrl + '/db/user/logout').done(function(resp) {
                Vue.notify({
                    title: _this.$t('m.logoutSuccess')
                });
                chatboxUtils.setBasicConfig({token:null});
                chatboxConfig.token = null;
            }).fail(function(xhr, status, error) {
                var msg =  _this.$t('e.logoutFailed');
                if (xhr.status !== 401) {
                    Vue.notify({
                        title: msg,
                        type: 'error'
                    });
                }
            }).always(function(){});
        },
        processCreditChange: function (delta) {
            this.credit += delta;

            if (delta > 0) delta = '+' +delta;
            Vue.notify({
                title: this.$t('m.credit') + ' ' + delta,
                type: 'success'
            });
        },
        registerCreditChangeSocketCallback: function () {
            var _this = this;
            chatboxSocket.registerCallback('credit_delta', function (delta) {
                _this.processCreditChange(delta);
            });
        },
        init () {
            var _this = this;
            this.registerCreditChangeSocketCallback();
            chatboxUtils.addBasicConfigChangeListener(function (configData) {
               console.log('[profile] config in storage changed, load again')
                _this.loadDataFromStorage(configData);
            });
            chatboxUtils.getBasicConfig(function (configData) {
                console.log('[profile] load config from storage.');
                _this.loadDataFromStorage(configData);
            });
        },
        loadDataFromStorage (configData) {
            if (!configData) {
                console.log('[profile] ERROR: no config data to load');
                return;
            } // when clearing local storage

            chatboxConfig.username = configData['username'];
            this.username = chatboxConfig.username;

            chatboxConfig.aboutMe = configData['about_me'];
            this.aboutMe = chatboxConfig.aboutMe;
            this.hasAvatar = configData['has_avatar'];
        }
    },
    watch: {
        'state.view': function (newView, prevView) {
            if (newView == 0 && chatboxConfig.token) {
                this.loadUser();
            }
        },
    },
    created () {
        chatboxUtils.processCreditChange = this.processCreditChange;
        chatboxUtils.loadUser = this.loadUser;
        this.init();
    }
}

</script>
