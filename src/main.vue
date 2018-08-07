<template>
    <div id="chatbox-main-vue">

        <div v-cloak v-show="state.display!='hidden'" id="socketchatbox-all" class="socketchatbox-page">
            <div id="socketchatbox-ne" class="socketchatbox-resize" @mousedown="resizeStart"></div>
            <top-bar v-cloak></top-bar>
            <div :style="{ height: state.height + 'px', width: state.width + 'px'}" id='socketchatbox-body' v-show="state.display=='full'">
                <div class='socketchatbox-onlineusers'></div>
                <div class = "socketchatbox-typing"> </div>
                <comment-body class="socketchatbox-body"></comment-body>
                <chat-body class="socketchatbox-body"></chat-body>
                <inbox-body class="socketchatbox-body"></inbox-body>
                <profile-body class="socketchatbox-body"></profile-body>
                <others-profile class="socketchatbox-body"></others-profile>
                <input-bar></input-bar>
            </div>
        </div>
    </div>
</template>

<style>
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
    box-shadow: 15px 15px 5px rgba(0, 0, 0, 0.3);
    font-family:Arial,Helvetica,sans-serif;
    font-size:12px;
    line-height: 1;
    z-index: 2147483646;
    text-align: left;
}
.socketchatbox-page * {
    box-sizing: border-box;
}

.socketchatbox-page * {
    box-sizing: border-box;
}
.socketchatbox-page-title {
    height: 30px;
    box-sizing: border-box;
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
    background: rgba(0,0,0,0.1); 
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

// expose chatbox config to window so it's easier to debug
window.chatbox = chatboxConfig;
window.chatboxUIState = chatboxUIState;
window.chatboxUtils = chatboxUtils;

export default {
    name: 'chatbox-main-vue',
    data () {
        return {
            state: chatboxUIState,
            prevX:-1,
            prevY:-1,
            dragX:-1 // TODO: for moving horizontally
        }
    },
    methods: {
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
        loadConfig () {
            console.log('Load config from storage');
            var _this = this;
            // load data from local storage / chrome storage
            chatboxUtils.storage.get('username', function (item) {
                if (item['username'])
                    chatboxConfig.username = item['username'];
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

                if (_this.state.display == 'full') {
                    _this.showChatboxFull();
                }
                if (_this.state.display == 'mini') {
                    _this.showChatboxMini();
                }
                if (_this.state.display == 'hidden') {
                    _this.hideChatbox();
                }
            });
            chatboxUtils.storage.get('danmu', function (item) {
                var display = item['danmu'];
                // Default danmu css is display: none
                // But we want default behavior is to show danmu

                if (!display)
                    display = 'block';
                chatboxUtils.toggleDanmu(display);
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
        this.loadConfig();
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
    }
}
</script>
