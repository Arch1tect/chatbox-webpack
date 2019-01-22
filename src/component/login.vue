<style>
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
    .gray-font {
        color: gray;
    }
</style>
<template>
    <div v-show="state.view==0 && !chatbox.token">
        <div class="socketchatbox-page-title">
            <span v-if="!registering">{{$t('m.login')}}</span>
            <span v-if="registering">{{$t('m.register')}}</span>
        </div>
        <div ref="profileArea" class="socketchatbox-profileArea">
            <center v-if="registering" class='show-change-password-form' @click='registering=false'>{{$t('m.loginInstead')}}</center>
            <center v-if="!registering" class='show-change-password-form' @click='registering=true'>{{$t('m.registerInstead')}}</center>
            <br/>
            <div v-if="!registering">
                <div class="login-forms-wrapper">
                    <span>{{$t('m.userNumId')}}</span>
                    <input maxlength="15" type="number" v-model="userNumId">
                    <br/>
                    <span>{{$t('m.password')}}</span>
                    <input maxlength="50" type="password" v-model="password">
                </div>
            </div>
            <div v-if="registering" class="login-forms-wrapper">
                <div class="gray-font">{{$t('m.registerInfo')}}</div>
                <br/>
                <span>{{$t('m.password')}}</span>
                <input ref="newPasswordInput" maxlength="20" type="password" v-model="newPassword">
                <br/>
                <span>{{$t('m.confirmPassword')}}</span>
                <input maxlength="20" type="password" v-model="confirmNewPassword">
                <br/>
                <div class="password-requiremnets">{{newPasswordRequirements}}</div>
            </div>
        </div>
        <button v-if="registering" :disabled="!canRegister" @click="freshRegister" class="socketchatbox-bottom-btn-wrapper">
            <span>{{$t('m.submit')}}</span>
        </button>
        <button v-if="!registering" @click="login" class="socketchatbox-bottom-btn-wrapper">
            <span>{{$t('m.submit')}}</span>
        </button>

    </div>
</template>

<script>
    import chatboxUIState from '../ui-state.js'
    import chatboxConfig from '../config.js'
    import chatboxUtils from '../utils.js'
    "use strict";
    export default {
        name: 'profile-body',
        data () {
            return {
                state: chatboxUIState,
                chatbox: chatboxConfig,
                registering: false,
                username: 'No name',
                userNumId: '',
                password: '', // For login
                newPassword: '', // For register
                confirmNewPassword: ''
            }
        },
        computed: {
            newPasswordRequirements: function () {
                if (this.newPassword.length>0 && this.newPassword.length < 8)
                    return this.$t('e.passwordTooShort');
                if (this.newPassword != this.confirmNewPassword)
                    return this.$t('e.passwordNotMatch');
            },
            canRegister: function () {
                return this.newPassword.length >= 8 && this.newPassword == this.confirmNewPassword
            }
        },
        methods: {
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
                        console.log('[login] login success!');
                        chatboxConfig.token = resp.token;
                        chatboxUtils.setBasicConfig({
                            token:resp.token,
                            user_id: resp.uuid,
                            id: _this.userNumId,
                            password: _this.password
                        });
                        if (resp.uuid !== chatboxConfig.userId) {
                            chatboxConfig.userId = resp.uuid;
                            // login a different account
                            console.log('login a different account');
                            // clear local inbox data
                            chatboxUtils.storage.set('chatbox-inbox', null);
                            chatboxUtils.storage.set('already-read-friends', null);
                        }
                        chatboxUtils.loadUser();
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
            tempFunctionToMigrateUserCreatedBefore270: function () {
                // userNumId must exist to use this function
                var _this = this;
                console.log('[register] user was created prior to 2.7.0, register auth now');
                if (!chatboxConfig.userNumId) console.log('[register] ERROR: no userNumId');
                var payload = {
                    'uuid': chatboxConfig.userId,
                    'id': chatboxConfig.userNumId,
                    'password': this.password
                };
                $.post(chatboxConfig.apiUrl + "/db/user/auth_migrate", payload, function(resp) {
                    chatboxUtils.setBasicConfig({password:_this.password});
                    console.log('auth migration success');
                    _this.login();
                })


            },
            freshAutuRegister () {
                // freshRegister is called by user manually
                // auto register is automatic, with auto
                // generated password
                this.newPassword = chatboxUtils.genPassword();
                this.freshRegister();
            },
            freshRegister () {
                // Fresh registration, create new set of
                // uuid, name with the password user entered
                // Nothing is saved unless register success

                console.log('[register] Fresh register user');
                var _this = this;
                var uuid = chatboxUtils.genGuid();
                var name  = 'u' + Math.floor(Math.random() * 1 * 1000 * 1000);

                var payload = {
                    'uuid': uuid,
                    'name': name,
                    'password': this.newPassword
                };
                Vue.notify({
                    title: this.$t('m.registering'),
                });
                $.post(chatboxConfig.apiUrl + "/db/user/register", payload, function(resp) {
                    if (resp.id && resp.id > 0) {
                        // Successful registration, save uuid, name and password
                        console.log('[register] Fresh registration success!');
                        chatboxConfig.userNumId = resp.id;
                        chatboxConfig.userId = uuid;
                        _this.userNumId = resp.id;
                        _this.password = _this.newPassword;
                        chatboxUtils.setBasicConfig({
                            id: chatboxConfig.userNumId,
                            user_id: chatboxConfig.userId,
                            username: name,
                            password: _this.newPassword,
                            has_avatar: false
                        });
                        // clear local inbox data
                        chatboxUtils.storage.set('chatbox-inbox', null);
                        chatboxUtils.storage.set('already-read-friends', null);
                        _this.login();
                    }
                }).fail(function() {
                    Vue.notify({
                        title: _this.$t('m.registerFailed'),
                        type: 'error'
                    });
                }).always(function(){
                    _this.newPassword = '';
                    _this.confirmNewPassword = '';
                });
            },
            register () {
                // This function expects that
                // uuid, username, password already created
                console.log('[register] Register user');
                if (!chatboxConfig.userId) console.log('[register] no uuid');
                if (!chatboxConfig.username) console.log('[register] no name');
                if (!chatboxConfig.password) console.log('[register] no password');
                var _this = this;
                var payload = {
                    'uuid': chatboxConfig.userId,
                    'name': chatboxConfig.username,
                    'password': this.password
                };
                Vue.notify({
                    title: this.$t('m.welcomeInstall'),
                });
                $.post(chatboxConfig.apiUrl + "/db/user/register", payload, function(resp) {
                    if (resp.id && resp.id > 0) {
                        // Successful registration, save the id!!!
                        console.log('[register] registration success!');
                        chatboxConfig.userNumId = resp.id;
                        chatboxUtils.setBasicConfig({
                            id: chatboxConfig.userNumId,
                            password: _this.password
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
                                chatboxUtils.processCreditChange(resp.credit_delta);
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
            }

        },
        created () {
            chatboxUtils.login = this.login;
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
                        chatboxUIState.view = 0;
                    }
                }
            });
            // load data from local storage
            // if there is token, user has logged in before
            // if there is no token but userNumId, user has registered
            // successfully before, try to login
            // if there is no token, no userNumId but uuid, should try to
            // register
            chatboxUtils.getBasicConfig(function (configData) {
                console.log('[login] load config from storage.');

                chatboxConfig.userId = configData['user_id'];
                chatboxConfig.userNumId = configData['id'];
                chatboxConfig.password = configData['password'];

                _this.password = chatboxConfig.password;
                _this.userNumId = chatboxConfig.userNumId;

                if (configData['token']) {
                    chatboxConfig.token = configData['token'];
                    console.log('[login] found token, go checkin.');
                    _this.checkin();
                    return;
                } else {
                    console.log('[login] no token in storage.');
                }

                if (configData['id']) {
                    console.log('[login] found id, go login');
                    if (configData['password']) {
                        // it's possible that there's no auth record
                        // if account created before 2.7.0,
                        // will need to register first
                        _this.password = configData['password'];
                        if (_this.password.length > 25) {
                            // account created prior to 2.7.0 has long password
                            _this.password = chatboxUtils.genPassword();
                            _this.tempFunctionToMigrateUserCreatedBefore270();
                        } else {
                            _this.login();
                        }
                    } else {
                        console.log('[login] ERROR: found id but no password locally');
                        // user already created in DB, there are 2 cases regarding auth:
                        // 1. no auth record created (before v2.7.0), we can create new password
                        // 2. auth record already created, nothing we can do
                        // handle 1st case
                        _this.password = chatboxUtils.genPassword();
                        _this.tempFunctionToMigrateUserCreatedBefore270();
                    }
                    return;
                }
                if (configData['user_id']) {
                    console.log('[login] found uuid');
                    // user created locally before but not registered in server
                    if (!configData['password']) {
                        // Shouldn't happen, but in this case
                        // we can safely create a new password since user
                        // hasn't registered in db yet
                        console.log('[login] ERROR: found uuid but no password locally, will create new password');
                        _this.password = chatboxUtils.genPassword();
                    }
                    _this.register();
                } else {
                    console.log('[login] no local uuid');
                    _this.freshAutuRegister();
                }
            });
        }
    }

</script>
