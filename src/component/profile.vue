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
    .login-forms-wrapper {
        width: 200px;
        margin:auto;
    }
    .login-forms-wrapper input {
        margin-top: 5px;
        width: 100%;
        line-height: 20px;
        padding: 5px;
        border-radius: 5px;
        border: 1px solid #d1d5da;
        display: block;
    }
</style>
<template>
    <div v-show="state.view==0">
        <div class="socketchatbox-page-title">
            <span v-if="chatbox.token">{{$t('m.selfProfile')}}</span>
            <span v-if="!chatbox.token">{{$t('m.login')}}</span>
        </div>
        <div class="socketchatbox-profileArea">
            <center v-if="chatbox.token">
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
                        <span>ID: {{chatbox.id}}</span>
                        <span>{{$t('m.credit')}}: {{chatbox.credit}}</span>
                    </div>
                    <div class="follower-stats">
                        <span @click="utils.viewFollowers(true, followings, followers)">{{$t('m.followingCount')}}: <span class="count">{{followings.length}}</span></span>
                        <span @click="utils.viewFollowers(false, followings, followers)">{{$t('m.followerCount')}}: <span class="count">{{followers.length}}</span></span>
                    </div>
                </div>
                <textarea v-model="aboutMe" :placeholder="$t('m.aboutMe')" class="socketchatbox-aboutme"></textarea>
            </center>
            <div v-if="!chatbox.token">
                <br/><br/><br/>
                <div class="login-forms-wrapper">
                    <span>{{$t('m.userNumId')}}</span>
                    <input maxlength="15" type="number" v-model="userNumId">
                    <br/>
                    <span>{{$t('m.password')}}</span>
                    <input maxlength="50" type="text" v-model="password">
                </div>

            </div>
        </div>

        <button v-if="chatbox.token" :disabled="!canSave" @click="save" class="socketchatbox-bottom-btn-wrapper half">
            <span>{{saveStr}}</span>
        </button>

        <button v-if="chatbox.token" @click="logout" class="socketchatbox-bottom-btn-wrapper half right-half red">
            <span>{{$t('m.logout')}}</span>
        </button>

        <button v-if="!chatbox.token" @click="login" class="socketchatbox-bottom-btn-wrapper">
            <span>{{$t('m.login')}}</span>
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
            id: '',
            savingName: false,
            savingImg: false,
            savingAboutMe: false,
            userNumId: '',
            password: ''
        }
    },
    computed: {
        saveStr: function () {
            if (this.savingName || this.savingImg)
                return this.$t('m.updating');
            else
                return this.$t('m.update');
        },
        canSave: function () {
            var saving = this.savingName || this.savingImg;
            if (saving) return false;
            var profileImgUpdated = this.imgFile;
            var nameUpdated = this.username !== this.chatbox.username;
            var aboutUpdated = this.aboutMe !== this.chatbox.aboutMe;

            return profileImgUpdated || nameUpdated || aboutUpdated;
        }
    },
    methods: {
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
            this.savingName = true;

            var payload = {
                'uuid': chatboxConfig.userId,
                'token': chatboxConfig.token,
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
                _this.savingName = false;
            });
        },
        saveAboutMe () {
            if (this.aboutMe == this.chatbox.aboutMe) {
                return;
            }
            this.savingAboutMe = true;
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
                _this.savingAboutMe = false;
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
                chatboxConfig.id = user.id;
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
        login () {
            Vue.notify({
                title: this.$t('m.loggingIn'),
                type: 'warn'
            });
            var _this = this;
            // login only when local token is denied
            // user manually trigger login
            var payload = {
                'id': this.userNumId,
                'password': this.password
            };
            $.post(chatboxConfig.apiUrl + '/db/user/login', payload).done(function(resp) {
                if (resp.token) {
                    Vue.notify({
                        title: _this.$t('m.loginSuccess')
                    });
                    chatboxConfig.token = resp.token;
                    chatboxUtils.setBasicConfig({token:resp.token});
                }
            }).fail(function(xhr, status, error) {
                var msg =  _this.$t('e.loginFailed');
                if (xhr.status == 404) {
                    msg = _this.$t('e.userNotFound');
                }
                if (xhr.status == 400) {
                    msg = _this.$t('e.wrongPassword');
                }
                Vue.notify({
                    title: msg,
                    type: 'error'
                });
                chatboxUtils.setBasicConfig({token:null});
                chatboxConfig.token = null;
            }).always(function(){});
        },
        checkin () {
            if (!chatboxConfig.tabVisible) return;
            var _this = this;
            chatboxUtils.getBasicConfig(function (configData) {
                var now = Date.now();
                var shouldCheck = false;
                if ('last_checkin_time' in configData) {
                    var delta = now - configData['last_checkin_time'];
                    if (delta > 60*60*1000) {
                        shouldCheck = true;
                        // Check in every hour to earn credit
                    }
                } else {
                    shouldCheck = true;
                }
                if (shouldCheck) {
                    chatboxUtils.setBasicConfig({last_checkin_time:now});
                    $.post(chatboxConfig.apiUrl + "/db/user/" + chatboxConfig.userId+'/checkin').done(function(resp) {
                        if (resp.credit_delta) {
                            _this.processCreditChange(resp.credit_delta);
                        }
                    }).fail(function (xhr, status, error) {
                        var msg =  _this.$t('m.checkinFailed');
                        if (xhr.status !== 401) {
                            Vue.notify({
                                title: msg,
                                type: 'error'
                            });
                        }
                    }).always(function(){});
                }
            });

        },
        registerUser (localExist) {

            console.log('[profile] Register user');
            console.log('[profile] Local existing user: '+localExist);
            if (!localExist) {
                chatboxConfig.userId = chatboxUtils.genGuid();
                this.password = chatboxUtils.genPassword();
                chatboxConfig.username = 'u' + Math.floor(Math.random() * 1 * 1000 * 1000);
                chatboxUtils.setBasicConfig({
                    user_id: chatboxConfig.userId,
                    username: chatboxConfig.username,
                    password: this.password,
                });
                this.username = chatboxConfig.username;
            }

            var _this = this;
            var payload = {
                'uuid': chatboxConfig.userId,
                'name': chatboxConfig.username,
                'password': this.password
            };

            $.post(chatboxConfig.apiUrl + "/db/user/register", payload, function(resp) {
                Vue.notify({
                    title: _this.$t('m.welcomeInstall'),
                });
                if (resp.id && resp.id > 0) {
                    // Successful registration, save the id
                    chatboxConfig.id = resp.id;
                    chatboxUtils.setBasicConfig({
                        id: chatboxConfig.id,
                    });
                    _this.userNumId = resp.id;
                    _this.login();
                }
            }).fail(function() {
                Vue.notify({
                    title: _this.$t('m.registerFailed'),
                    type: 'error'
                });
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
            $.ajaxSetup({
                error: function (x, status, error) {
                    if (x.status == 401) {
                        chatboxConfig.token = null;
                        chatboxUtils.setBasicConfig({token:null});
                        Vue.notify({
                            title: _this.$t('e.wrongToken'),
                            type: 'error'
                        });
                    }
                }
            });
            this.registerCreditChangeSocketCallback();
            chatboxUtils.getBasicConfig(function (configData) {
                if ('id' in configData) {
                    console.log('[profile] User has registered.');
                    // id is returned from server, if client doesn't have it
                    // then needs to register
                    chatboxConfig.id = configData['id'];
                    chatboxConfig.userId = configData['user_id'];
                    chatboxConfig.username = configData['username'];
                    chatboxConfig.aboutMe = configData['about_me'];
                    _this.hasAvatar = configData['has_avatar'];
                    _this.username = chatboxConfig.username;
                    _this.aboutMe = chatboxConfig.aboutMe;
                    _this.userNumId = chatboxConfig.id;
                    _this.password = configData['password'];
                    // check if there is token
                    if ('token' in configData && configData['token']) {
                        console.log('[profile] found token in local storage');
                        chatboxConfig.token = configData['token'];
                        _this.checkin();
                    }else {
                        _this.login();
                    }

                } else {
                    if ('user_id' in configData) {
                        // user created locally but failed to register previously
                        chatboxConfig.userId = configData['user_id'];
                        chatboxConfig.username = configData['username'];
                        chatboxConfig.aboutMe = configData['about_me'];
                        _this.username = chatboxConfig.username;
                        _this.aboutMe = chatboxConfig.aboutMe;
                        _this.password = configData['password'];
                        _this.registerUser(true);
                    } else {
                        _this.registerUser(false);
                    }
                }

            });
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
        this.init();
    }
}

</script>
