<template>
    <div id="chatbox-main-vue">

        <div v-cloak v-show="state.display!='hidden'" id="socketchatbox-all" class="socketchatbox-page" :style="{ marginLeft: marginLeft }">
            <div v-if="state.display=='full'" id="socketchatbox-ne" class="socketchatbox-resize" @mousedown="resizeStart"></div>
            <top-bar v-cloak></top-bar>
            <div :style="{ height: state.height + 'px', width: state.width + 'px'}" id='socketchatbox-body' v-show="state.display=='full'">
                <comment-body class="socketchatbox-body"></comment-body>
                <chat-body class="socketchatbox-body"></chat-body>
                <inbox-body class="socketchatbox-body"></inbox-body>
                <profile-body class="socketchatbox-body"></profile-body>
                <others-profile class="socketchatbox-body"></others-profile>
                <notifications position="bottom"/>
                <input-bar></input-bar>
            </div>
        </div>
    </div>
</template>

<style>
.socketchatbox-page-title .fa.fa-power-off {
    color:lightgray;
    margin-left: 5px;
    margin-right: 0px;
}
#socketchatbox-live-status:hover .fa.fa-power-off {
    color:white;
}

.socketchatbox-page-title .fa:hover {
    color: black;
}
.fa, .no-text-selection {
  -webkit-user-select: none;  /* Chrome all / Safari all */
  -moz-user-select: none;     /* Firefox all */
  -ms-user-select: none;      /* IE 10+ */
  user-select: none;          /* Likely future */      
}
.notifications {
    bottom: 35px !important;
    width: 100% !important;
}
.vue-notification {
    margin: 0px;
    border-left: none;
}
.notification-title {
    font-weight: 300;
    text-align: center;
}
button:focus {
    outline: none;
}
.float-right {
  float: right;
}
.svg-inline--fa:active {
  background: lightgray;
}
.socketchatbox-page {
    box-sizing: border-box;
    border: 1px solid lightgray;
    border-top: none;
    position: fixed;
    bottom:0px;
    font-family:Arial,Helvetica,sans-serif;
    font-size:12px;
    line-height: 1;
    z-index: 2147483646;
    text-align: left;
    box-shadow: 15px 15px 5px rgba(0, 0, 0, 0.3);
}
.socketchatbox-page * {
    box-sizing: border-box;
}

.socketchatbox-page * {
    box-sizing: border-box;
}
.socketchatbox-page-title {
    height: 30px;
    border-bottom: 1px solid lightgray;
    width: 100%;
    text-align: center;
    background: white;
    padding: 8px;
    padding-left: 10px;
    padding-right: 10px;
}
.socketchatbox-page-title .fa {
    cursor: pointer;
}
.socketchatbox-body {
  width: 100%;
  height: 100%;
  background: #eceff1;
}
[v-cloak] { display:none; }
/* Let's get this party started */
.socketchatbox-page ::-webkit-scrollbar {
    width: 7px;
}
 
/* Track */
.socketchatbox-page ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 1px lightgray; 
}
 
/* Handle */
.socketchatbox-page ::-webkit-scrollbar-thumb {
    background: #ccc; 
    /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); */
}
.socketchatbox-page ::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(0,0,0,0.05); 
}
</style>
<script>
import Vue from 'vue'

import chatboxUIState from './ui-state.js'
import chatboxConfig from './config.js'
import chatboxUtils from './utils.js'
import chatboxSocket from './socket.js'

var MIN_WIDTH = 275;
var MIN_HEIGHT = 100;

// expose chatbox config to window so it's easier to debug
window.Vue = Vue;
window.chatbox = chatboxConfig;
window.chatboxUIState = chatboxUIState;
window.chatboxUtils = chatboxUtils;
export default {
    name: 'chatbox-main-vue',
    data () {
        return {
            tabHidden: 'hidden',
            state: chatboxUIState,
            prevX:-1,
            prevY:-1,
        }
    },
    computed: {
        marginLeft: function () {
            if (this.state.shwModal)
                return this.state.left + 'px';
            return '0px';
        },
    },
    methods: {
        handleTabVisibilityChange() {
            // reconnect/disconnect base on tab visibility
            // ensure socket has been initiated properly
            if (document[this.tabHidden]) {
                chatboxConfig.tabVisible = false;
                chatboxUtils.runTabInvisibleCallbacks();
            } else {
                chatboxConfig.tabVisible = true;
                chatboxUtils.runTabVisibleCallbacks();
            }
        },
        resizeStart (e) {
            this.prevX = e.screenX;
            this.prevY = e.screenY;
            chatboxUtils.updateIframeSize('full size');
        },
        resizeEnd (e) {
            // on document mouse up event is fired
            // very often, only handle resize end if need to
            if (this.prevX !== -1) {
                this.prevX = -1;
                this.prevY = -1;
                chatboxUtils.updateIframeSize('fit');
                var size = {
                    'width': this.state.width,
                    'height': this.state.height
                }
                chatboxUtils.storage.get('chatbox_config', function(item) {
                    var configData = item['chatbox_config'] || {};
                    configData['size'] = size;
                    chatboxUtils.storage.set('chatbox_config', configData);
                })
                
            }
        },
        resizing (e) {
            if (this.prevX !== -1) {
                // e.preventDefault();
                var dx = e.screenX - this.prevX;
                var dy = e.screenY - this.prevY;
                this.state.height -= dy;
                this.state.width += dx;
                this.prevX = e.screenX;
                this.prevY = e.screenY;
                if(this.state.width<MIN_WIDTH) {
                    this.state.width = MIN_WIDTH;
                }
                if(this.state.height<MIN_HEIGHT) {
                    this.state.height = MIN_HEIGHT;
                }
            }
        },
        decideChatboxDisplay () {
            if (this.state.display == 'full') {
                this.showChatboxFull();
            }
            if (this.state.display == 'mini') {
                this.showChatboxMini();
            }
            if (this.state.display == 'hidden') {
                this.hideChatbox();
            }
        },
        showChatboxFull () {
            console.log('show chatbox full');
            this.state.display = 'full';
            Vue.nextTick(function(){
                chatboxUtils.updateIframeSize('fit');
            });
        },
        showChatboxMini () {
            console.log('show chatbox mini');
            this.state.display = 'mini';
            Vue.nextTick(function(){
                chatboxUtils.updateIframeSize('fit');
            });
        },
        hideChatbox () {
            // This is hiding entire iframe, not minimize
            console.log('hide chatbox');
            this.state.display = 'hidden';
            chatboxUtils.updateIframeSize('close');
        },
        registerUser () {
            var _this = this;
            var payload = {
                'uuid': chatboxConfig.userId,
                'name': chatboxConfig.username
            }
            $.post(chatboxConfig.apiUrl + "/db/user/change_name", payload, function(resp) {
                Vue.notify({
                  title: _this.$t('m.welcomeInstall'),
                });
            })
        },
        loadConfigFromStorage () {
            console.log('Load config from storage');
            var _this = this;
            chatboxUtils.storage.get('chatbox_config', function (item) {
                var configData = item['chatbox_config'] || {};
                var needRegister = false;
                if ('user_id' in configData) {
                    chatboxConfig.userId = configData['user_id'];
                } else {
                    // 1st time open, also save user in DB
                    chatboxConfig.userId = chatboxUtils.genGuid();
                    configData['user_id'] = chatboxConfig.userId;
                    needRegister = true;
                }
                if ('username' in configData) {
                    chatboxConfig.username = configData['username'];
                } else {
                    chatboxConfig.username = 'u'+Math.floor(Math.random() * 1*1000*1000);
                    configData['username'] = chatboxConfig.username;
                }
                if ('size' in configData) {
                    var size = configData['size'];
                    _this.state.width = parseInt(size['width']);
                    _this.state.height = parseInt(size['height']);
                }
                if ('display' in configData) {
                    _this.state.display = configData['display'];
                }
                if ('left' in configData) {
                    chatboxUIState.left = parseInt(configData['left']);
                    console.log(chatboxUIState.left);
                    window.parent.postMessage({state: 'moving', dx: chatboxUIState.left}, "*");
                }
                if ('livechat_danmu' in configData) {
                    chatboxConfig.livechatDanmu = configData['livechat_danmu'];
                }
                if ('invitation_danmu' in configData) {
                    chatboxConfig.invitationDanmu = configData['invitation_danmu'];
                }
                if ('redirect' in configData) {
                    var allowUrlDict = configData['redirect']||{};
                    if (chatboxConfig.location in allowUrlDict) {
                        chatboxConfig.redirected = true;
                        delete allowUrlDict[chatboxConfig.location];
                        // override disply mode to full size
                        _this.state.display = 'full';
                    }
                }
                if ('livechat_anywhere' in configData) {
                    chatboxConfig.liveChatEnabled = configData['livechat_anywhere'];
                }

                if ('same_page_chat' in configData) {
                    chatboxConfig.samePageChat = configData['same-page-chat'];
                }


                chatboxConfig.configLoaded = true;
                chatboxUtils.storage.set('chatbox_config', configData);
                if(needRegister) {
                    _this.registerUser();
                }
                _this.decideChatboxDisplay();
                chatboxUtils.loadComments();
            });
        },
        listenToExtension () {
            var _this = this;
            // Listen to command from popup.js (extension only)
            // some commands are also sent to content.js danmu.js
            chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
                if (!request.chatboxMsg)
                    return;
                var msg = request.chatboxMsg;
                console.log(msg);
                // Receive message sent from extension
                if (msg == "open_chatbox") {
                    _this.showChatboxFull();
                    sendResponse({msg: "shown"});
                }
                if (msg == "connect_chatbox") {
                    // deprecated, shouldn't be called
                    chatboxConfig.liveChatEnabled = true;
                    if (!chatboxSocket.isConnected()) {
                        chatboxSocket.connect();
                        Vue.notify({
                          title: _this.$t('m.connecting'),
                          type: 'warn'
                        });
                    }
                }
                if (msg == "disconnect_chatbox") {
                    // deprecated
                    chatboxConfig.liveChatEnabled = false;
                    chatboxSocket.disconnect();
                }
                if (msg == "close_chatbox") {
                    _this.hideChatbox();
                    sendResponse({msg: "closed"}); // updateIframeSize is async so this response is wrong ??? why I thought this is wrong?
                }
                if (msg == "is_chatbox_open") {
                    sendResponse(
                        {
                            is_chatbox_open: _this.state.display == 'full',
                            userCount: chatboxSocket.userCount,
                            unreadDirectMsg: chatboxConfig.unreadDirectMsg,
                            unreadLiveMsg: chatboxConfig.unreadLiveMsgTotal,
                            comments: chatboxConfig.commentsTotal
                        }
                    );
                }
                if (msg.name == "toggle-danmu") {
                    if (msg['type'] == 'livechat') {
                        chatboxConfig.livechatDanmu = msg['value'];
                    }
                    if (msg['type'] == 'invitation') {
                        chatboxConfig.invitationDanmu = msg['value'];
                    }
                }
            });
        }
    },
    created () {
        chatboxConfig.lang = this.$i18n.locale;
        if (chatboxConfig.detectLocation) {
            chatboxConfig.location = location.search.substring(1);
        }
        chatboxConfig.domain = chatboxUtils.extractRootDomain(chatboxConfig.location);
        this.loadConfigFromStorage();
        if (chatboxUtils.runningExtension) {
            this.listenToExtension();
        }
        var _this = this;
        $(window).mouseup(function(e){
            _this.resizeEnd(e);
        });
        $(window).mousemove(function(e){
            _this.resizing(e);
        })
        window.addEventListener("message", function(e) {
            // danmu clicked
            if(e && e.data && e.data.openChatbox) {
                _this.showChatboxFull();
            }
        }, false);

        if (!chatboxUtils.runningExtension) {
            // Safari doesn't display 
            setTimeout(function(){
                console.log('refresh chatbox for safari');
                chatboxUIState.display = "full";
                _this.showChatboxFull();
            }, 1000);
        }

        // Set the name of the hidden property and the change event for visibility
        var visibilityChange; 
        if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
          this.tabHidden = "hidden";
          visibilityChange = "visibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
          this.tabHidden = "msHidden";
          visibilityChange = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
          this.tabHidden = "webkitHidden";
          visibilityChange = "webkitvisibilitychange";
        }

        // Warn if the browser doesn't support addEventListener or the Page Visibility API
        if (typeof document.addEventListener === "undefined" || this.tabHidden === undefined) {
          console.log("browser needs to support the Page Visibility API.");
        } else {
          // Handle page visibility change   
          document.addEventListener(visibilityChange, this.handleTabVisibilityChange, false);
        }

    }

}
</script>
