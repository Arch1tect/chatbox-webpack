<template>
    <div id="socketchatbox-danmu">
        <div v-for="msg in messages" :key="msg.danmuId">
            <div :ref="'msg' + msg.danmuId" v-html="msg.content" v-bind:class="{danmu: true, foo: true}" v-on:mouseover="hover(msg)" v-on:mouseleave="resume(msg)">
            </div>
        </div>
    </div>
</template>
<style>
.danmu {
    position: fixed;
    box-shadow: 0 0 6px #B2B2B2;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.9);
    max-width: 800px;
    padding: 10px;
    padding-bottom: 5px;
    padding-top: 5px;
    z-index: 2147483647;
    font-family: Arial,Helvetica,sans-serif;
    font-size: 12px;
}
</style>
<script>
import Vue from 'vue'

import chatboxUIState from './ui-state.js'
import chatbox from './config.js'
import chatboxUtils from './utils.js'

/*
Danmu positioning

Avoiding overlapping is tricky, basic solution is to have
x rows and only fill in new message to the empty row.
When no row is empty, just wait

This isn't optimal because there may be short comment on some 
row but we don't allow adding more message to that row


*/
// Need a separate counter since this.messages change length dynamically
var danmuId = 0;
const totalRowNum = 10;
var waitlist = [];
"use strict"
var testDanmu = [
    {
        content: 'Hello!',
    },
    {
        content: 'Many thanks to Robin Rendle, Chris Coyier, Blake Newman, and Evan You.',
    }

]
export default {
    name: 'danmu',
    data () {
        return {
            state: chatboxUIState,
            messages: [],
        }
    },
    methods: {
        hover: function (msg) {
            msg.animation.pause();
        },
        resume: function (msg) {
            msg.animation.play();
        },
        findSpot: function () {
            // Loop through active messages to find
            // occupied rows then find the first available
            // row, if not found, return false
            var freeSpot = null;
            var occupied = {};
            var i = 0;
            for (; i < this.messages.length; i++) {
                var msg = this.messages[i];
                occupied[msg.row] = true;
            }
            var j = 1;
            for (; j < totalRowNum; j ++) {
                if (!(j in occupied)) {
                    return j;
                }
            }
            return false;
        },
        queueMsgs: function (messages) {
            var i = 0;
            for (; i<messages.length; i++)
                this.queueMsg(messages[i]);
        },
        removeMsg: function (msg) {
            var i = this.messages.indexOf(msg);
            this.messages.splice(i, 1);
        },
        queueMsg: function (msg) {
            waitlist.push(msg);
            this.checkDanmu();
        },
        addMsg: function (message, inRow) {
            var msg = {
                row: inRow,
                content: message.content
            }
            danmuId = danmuId + 1;
            msg.danmuId = danmuId;
            // TODO: always call it content rather than message
            if (!msg.content)
                msg.content = message.message;
            this.messages.push(msg);
            var _this = this;
            Vue.nextTick(function() {
                // not safe to use index
                var el = _this.$refs['msg'+msg.danmuId][0];
                // mod 10 so it doesn't go below ~300 px
                el.style.top = 10 + msg.row*35 + 'px';
                var startX = window.innerWidth + 'px';
                var time = 10;
                if (msg.content)
                    time = 20 - msg.content.length/10;
                if (time < 8)
                    time = 8;
                msg.animation = el.animate([
                      // keyframes, at least two
                      // { transform: 'translateY(200px)' },
                      { transform: 'translateX('+startX+')' }, 
                      { transform: 'translateX(-1000px)' }
                    ], 
                    { 
                      // timing options
                      duration: time*1000,
                    }
                );
                msg.animation.onfinish = function () {
                    _this.removeMsg(msg);
                };

            })
        },
        checkDanmu: function () {
            while(waitlist.length) {
                var spot = this.findSpot();
                if (spot) {
                    var msg = waitlist.shift();
                    this.addMsg(msg, spot);
                } else {
                    // If no available spot, wait and check again later
                    var _this = this;
                    setTimeout(function(){
                        _this.checkDanmu();
                    }, 3*1000);
                    break;
                }
            }

        },
        loadTestData: function () {
            this.queueMsgs(testDanmu);
        }
    },
    created: function () {
        chatbox.addMsgToDanmu = this.queueMsg;
        chatbox.addMsgsToDanmu = this.queueMsgs;
        this.loadTestData();
        this.checkDanmu();
    }
}
</script>
