<template>
    <div id="chatbox-main-vue">

        <div v-cloak v-show="state.display!='hidden'" id="socketchatbox-all" class="socketchatbox-page">
            <div id="socketchatbox-ne" class="socketchatbox-resize" @mousedown="resizeStart"></div>
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
.socketchatbox-bottom-btn-wrapper {
  width: 100%;
  height: 35px;
  border: none;
  border-top: 1px solid lightgray;
  float: left;
  border-radius: 0;
  background: white;
  color: black;
  font-weight: 400;
}
.socketchatbox-bottom-btn-wrapper:hover {
  /*background:white;*/
  cursor: pointer;
}
.socketchatbox-bottom-btn-wrapper span.fa {
  margin-right: 5px; 
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
}
.socketchatbox-page-title .svg-inline--fa {
    margin-right: 10px;
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

var MIN_WIDTH = 300;
var MIN_HEIGHT = 100;
var DISCONNECT_DELAY_TIME = 10*60*1000; // 10 min

// expose chatbox config to window so it's easier to debug
window.Vue = Vue;
window.chatbox = chatboxConfig;
window.chatboxUIState = chatboxUIState;
window.chatboxUtils = chatboxUtils;
var disconnectTimer = null;
export default {
    name: 'chatbox-main-vue',
    data () {
        return {
            tabHidden: 'hidden',
            state: chatboxUIState,
            prevX:-1,
            prevY:-1,
            dragX:-1 // TODO: for moving horizontally
        }
    },
    methods: {
        disconnectAfterHiddenSomeTime() {
            disconnectTimer = setTimeout(function(){
                chatboxSocket.disconnect();
            }, DISCONNECT_DELAY_TIME)
        },
        handleTabVisibilityChange() {
            // reconnect/disconnect base on tab visibility
            // ensure socket has been initiated properly
            if (document[this.tabHidden]) {
                chatboxConfig.tabVisible = false;
                this.disconnectAfterHiddenSomeTime();
            } else {
                chatboxConfig.tabVisible = true;
                if (disconnectTimer) {
                    clearTimeout(disconnectTimer);
                }
                if(chatboxConfig.liveChatEnabled && !chatboxSocket.state.connected) {chatboxSocket.connect();
                    Vue.notify({
                      title: 'Connecting...',
                      type: 'warn'
                    });
                }
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
                chatboxUtils.storage.set('width', this.state.width);
                chatboxUtils.storage.set('height', this.state.height);
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
        resizing (e) {
            if (this.prevX !== -1) {
                e.preventDefault();
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
        registerUser () {
            if (chatboxConfig.userId && chatboxConfig.username) {
                var payload = {
                    'uuid': chatboxConfig.userId,
                    'name': chatboxConfig.username
                }
                $.post(chatboxConfig.apiUrl + "/db/user/change_name", payload, function(resp) {
                    Vue.notify({
                      title: 'Welcome to use chat anywhere!',
                    });
                })
            } else {
                var _this = this;
                setTimeout(function () {
                    _this.registerUser()
                }, 500);
            }

        },
        loadConfigFromStorage () {
            console.log('Load config from storage');
            var _this = this;
            // load data from local storage / chrome storage
            chatboxUtils.storage.get('user-id', function (item) {
                if (item['user-id']) {
                    chatboxConfig.userId = item['user-id'];
                } else {
                    // 1st time open, also save user in DB
                    chatboxConfig.userId = chatboxUtils.genGuid();
                    chatboxUtils.storage.set('user-id', chatboxConfig.userId);
                    _this.registerUser();
                }
                chatboxUtils.loadComments();
            });
            chatboxUtils.storage.get('username', function (item) {
                if (item['username']) {
                    chatboxConfig.username = item['username'];
                } else {
                    chatboxConfig.username = 'u'+Math.floor(Math.random() * 1*1000*1000);
                    chatboxUtils.storage.set('username', chatboxConfig.username);
                }

            });
            chatboxUtils.storage.get('share-location', function (item) {
                if (item && item['share-location']) {
                    if (item['share-location'] === 'no') chatboxConfig.shareLocation = false;
                }
            });
            chatboxUtils.storage.get('width', function (item) {
                if (item && item['width'])
                    _this.state.width = parseInt(item['width']);
            });
            chatboxUtils.storage.get('height', function (item) {
                if (item && item['height'])
                    _this.state.height = parseInt(item['height']);
            });
            chatboxUtils.storage.get('display', function (item) {

                if (item && item['display']) 
                    _this.state.display = item['display'];
                console.log('chatbox.display: '+_this.state.display);
                _this.decideChatboxDisplay();

            });
            chatboxUtils.storage.get('danmu', function (item) {
                var display = item['danmu'];
                // Default danmu css is display: none
                // But we want default behavior is to show danmu
                if (!display)
                    display = 'block';
                chatboxUtils.toggleDanmu(display);
            });
            chatboxUtils.storage.get('whitelist', function (item) {
                var whitelist = item['whitelist'];
                var url = chatboxUtils.extractRootDomain(chatboxConfig.location);
                if (whitelist && url in whitelist) {
                    // This is the initial connection
                    chatboxConfig.liveChatEnabled = true;
                    chatboxSocket.connect();
                    Vue.notify({
                      title: 'Connecting...',
                      type: 'warn'
                    });
                }
            });
        },
        listenToExtension () {
            var _this = this;
            // Listen to command from popup.js (extension only)
            // command always go from popup.js to chatbox frame then
            // go to content.js/danmu.js if needed, no direct messaging
            // between pop.js and content/danmu.js
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
                    chatboxConfig.liveChatEnabled = true;
                    chatboxSocket.connect();
                    Vue.notify({
                      title: 'Connecting...',
                      type: 'warn'
                    });

                }
                if (msg == "disconnect_chatbox") {
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
                            userCount: chatboxSocket.userCount
                        }
                    );
                }
                if (msg.name == "toggle-danmu") {
                    chatboxUtils.toggleDanmu(msg.value);
                }
            });
        }
    },
    created () {
        if (chatboxConfig.detectLocation) {
            chatboxConfig.location = location.search.substring(1);
        }
        this.loadConfigFromStorage();
        if (chatboxUtils.runningExtension) {
            this.listenToExtension();
        }
        var _this = this;
        $(document).mouseup(function(e){
            _this.resizeEnd(e);
        });
        $(document).mousemove(function(e){
            _this.resizing(e);
        })

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
