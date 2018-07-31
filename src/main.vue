<template>
    <div id="chatbox-main-vue">

        <div id="socketchatbox-all" class="socketchatbox-page">
            <div id="socketchatbox-ne" class="socketchatbox-resize" @mousedown="resizeStart"></div>
            <top-bar></top-bar>
            <div :style="{ height: height + 'px', width: width + 'px'}" id='socketchatbox-body' v-show="!state.mini">
                <div class='socketchatbox-onlineusers'></div>
                <div class = "socketchatbox-typing"> </div>
                <comment-body></comment-body>
                <chat-body></chat-body>
                <inbox-body></inbox-body>
                <input-bar></input-bar>
                <comment-btn></comment-btn>
            </div>
        </div>

    </div>
</template>

<style>
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

.socketchatbox-chatroom-wrapper {
  height: 100%;
  background: #eceff1;
}
[v-cloak] { display:none; }
/* Let's get this party started */
.socketchatbox-page::-webkit-scrollbar {
    width: 5px;
}
 
/* Track */
.socketchatbox-page::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 1px lightgray; 
}
 
/* Handle */
.socketchatbox-page::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.1); 
    /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); */
}
.socketchatbox-page::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(0,0,0,0.05); 
}
</style>
<script>
import Vue from 'vue'

import chatboxUIState from './ui-state.js'
import chatbox from './config.js'
import chatboxUtils from './utils.js'

var MIN_WIDTH = 250;
var MIN_HEIGHT = 100;

// expose chatbox to window so it's easy to debug
window.chatbox = chatbox;
window.chatboxUIState = chatboxUIState;
// window.Vue = Vue;

export default {
    name: 'chatbox-main-vue',
    data () {
        return {
            state: chatboxUIState,
            height: 350,
            width:350,
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
            }
        },
        resizing (e) {
            if (this.prevX !== -1) {
                var dx = e.screenX - this.prevX;
                var dy = e.screenY - this.prevY;
                this.height -= dy;
                this.width += dx;
                this.prevX = e.screenX;
                this.prevY = e.screenY;
                if(this.width<MIN_WIDTH) {
                    this.width = MIN_WIDTH;
                }
                if(this.height<MIN_HEIGHT) {
                    this.height = MIN_HEIGHT;
                }

            }
        }
    },
    watch: {
        'state.mini': function (newVal, oldVal) {
            var state = 'fit';
            if (newVal)
                state = 'minimize';
            Vue.nextTick(function(){
                chatboxUtils.updateIframeSize(state);
            });
        }
    },
    created () {
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
