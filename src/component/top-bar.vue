<template>
    <div v-on:click="toggleChatbox" @mousedown="dragStart" v-bind:class="{ mini: state.display == 'mini' }" id='socketchatbox-top'>

        <div v-cloak v-show="state.display == 'full'" data-toggle="tooltip" data-placement="bottom" id='socketchatbox-username'>{{config.username}}</div>
        <span v-on:click='handleMissClick($event)' id='topbar-options' class='float-right'>
            <span v-on:click='topOptionClicked(1, $event)' class="top-option" :title="$t('m.commentTab')" data-toggle="tooltip" data-placement="bottom" id='socketchatbox-comments'>
                <font-awesome-icon icon="comment-alt" class="fa fa-comment-alt"  v-bind:class="{ selected: state.view==1 }" />
                <span v-show="state.display == 'mini' && config.commentsTotal > 0" class="total-num">{{config.commentsTotal}}</span>
            </span>
            <span v-on:click='topOptionClicked(2, $event)' class="top-option" :title="$t('m.chatTab')" data-toggle="tooltip" data-placement="bottom" id='socketchatbox-live'>
                <font-awesome-icon icon="comments" class="fa fa-comments"  v-bind:class="{ selected: state.view==2 }" />
                <span v-show="config.unreadLiveMsgTotal>0" class="unread-notification-dot"></span>
            </span>
            <span v-on:click='topOptionClicked(3, $event)' class="top-option" :title="$t('m.inboxTab')" data-toggle="tooltip" data-placement="bottom" id='socketchatbox-inbox'>
                <font-awesome-icon icon="inbox" class="fa fa-inbox"  v-bind:class="{ selected: state.view==3 }" />
                <span v-show="config.unreadDirectMsg>0" class="unread-notification-dot"></span>
            </span>
            <span v-on:click='topOptionClicked(0, $event)' class="top-option" v-show="state.display == 'full'" :title="$t('m.profileTab')" data-toggle="tooltip" data-placement="bottom" id='socketchatbox-profile'><font-awesome-icon icon="user-circle" class="fa fa-user" v-bind:class="{ selected: state.view==0 }" /></span>

            <span v-on:click='hideChatbox($event)' class="top-option" :title="$t('m.close')"><font-awesome-icon  icon="times" class="fa fa-close" title='Close' data-toggle="tooltip" data-placement="bottom" id='socketchatbox-closeChatbox' /></span>
        </span>
    </div>
</template>
<style>
.unread-notification-dot {
    position: absolute;
    top: 2px;
    background: orange;
    margin-left: 18px;
    border-radius: 100%;
    width: 12px;
    height: 12px;
}
.top-option .total-num {
    float: right;
    color: gray;
}
.top-option {
    display: inline-block;
}
.socketchatbox-resize {
  top:0px;
  height:20px;
  width:15px;
  position:absolute;
  z-index: 99999;
}

#socketchatbox-nw {
  left:0px; 
  cursor:nw-resize; 
}

#socketchatbox-ne{
  right:0px;
  cursor:ne-resize; 
}

#topbar-options {
  margin-right: 15px;
  font-size: 15px;
}
#topbar-options .fa {
    color: lightgray;
    line-height: 30px;
    font-size: 30px;
    padding-left: 7px;
    padding-right: 7px;
}
#topbar-options .fa-close {
  width: 0.9em;
}
#topbar-options .fa:hover{
  background: gray;;
  color:white;
}

#topbar-options .fa.selected{
 background: white;;
  color:black;
}
.mini #topbar-options .fa {
    color:#b2b2b2 !important;
    background:none !important;
}
.mini #topbar-options .fa:hover {
    color:#b2b2b2 !important;
    background:none !important;
}
#socketchatbox-username {
  float:left;
  /*padding-left: 10px;*/
  padding-right: 10px;
  color: white;
  /*display: none;*/
  white-space: nowrap;
  overflow: hidden;
  /*max-width: calc(100% - 160px);  */
  max-width: 80px;  
  min-width: 30px;
  text-align: center;
}

#socketchatbox-top {
  min-width: 180px;
    border-top: 1px solid;
  cursor: pointer;
  height: 30px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.75);
  padding-left: 10px;
  box-shadow: -1px 0px 0, 1px 0px 0;
  line-height: 30px;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

#socketchatbox-top.mini {
    box-shadow: none;
    border-top: 1px solid lightgray;

    background: rgba(255, 255, 255, 0.9);
}
#socketchatbox-top.mini:hover {
  background: rgba(255, 255, 255, 1);
}
</style>
<script>
import Vue from 'vue'

import chatboxConfig from '../config.js'
import chatboxUIState from '../ui-state.js'
import chatboxUtils from '../utils.js'
import chatboxSocket from '../socket.js'

export default {
    name: 'top-bar',
    data () {
        return {
            config: chatboxConfig,
            state: chatboxUIState,
            socket: chatboxSocket,
            prevMoveX: -1,
            isDragging: false
        }
    },
    watch: {
        'socket.state.connected': function (newVal, oldVal) {
            if (newVal) {
                Vue.notify({
                    title: this.$t('m.connected'),
                });
            } else {
                Vue.notify({
                    title: this.$t('m.disconnected'),
                    type: 'warn'
                });
            }
        }
    },
    methods: {
        dragStart (e) {
            this.prevMoveX = e.screenX;
            // full size iframe is necessary because the event listener is 
            // inside iframe, once cursor move outside iframe, it can't track
            this.isDragging = false; // set to true when mousemove
        },
        dragEnd (e) {
            if (this.prevMoveX !== -1) {
                // e.preventDefault();
                // e.stopPropagation();
                this.prevMoveX = -1;
                chatboxUtils.updateIframeSize('fit');
                var _this = this;
                chatboxUtils.storage.get('chatbox_config', function(item) {
                    var configData = item['chatbox_config'] || {};
                    configData['left'] = _this.state.left;
                    chatboxUtils.storage.set('chatbox_config', configData);
                })
            }
        },
        dragging (e) {
            if (this.prevMoveX !== -1) {
                if (!this.isDragging) {
                    chatboxUtils.updateIframeSize('full size');
                    this.isDragging = true;
                }
                // e.preventDefault();
                // e.stopPropagation();
                var dx = e.screenX - this.prevMoveX;
                this.state.left += dx;
                // TODO: Pass x rather than dx seems easier
                this.prevMoveX = e.screenX;
                window.parent.postMessage({state: 'moving', dx: dx}, "*");
            }
        },
        topOptionClicked: function (view, event) {
            if (this.isDragging || this.state.display == 'mini') {
                return;
            }
            this.state.view = view;
            event.stopPropagation();
        },
        handleMissClick: function (event) {
            // hacky solution for user clicking on the gap 
            // between top bar options
            if (this.state.display == 'full') {
                event.stopPropagation();
            }
        },
        toggleChatbox: function () {
            if (this.isDragging) return;
            if (this.state.display == 'mini') {
                this.state.display = 'full';
            } else {
                this.state.display = 'mini';
            }
            Vue.nextTick(function(){
                chatboxUtils.updateIframeSize('fit');
            });
            // No need to change config setting here
        },
        hideChatbox: function (event) {
            // This is hiding entire iframe, not minimize
            // duplicate function in main.vue, should be the same
            if (this.isDragging) return;
            this.state.display = 'hidden';
            chatboxUtils.updateIframeSize('close');
            event.stopPropagation();

        }
    },
    created () {
        var _this = this;
        $(window).mouseup(function(e){
            _this.dragEnd(e);
        });
        $(window).mousemove(function(e){
            _this.dragging(e);
        })
    }
}
</script>
