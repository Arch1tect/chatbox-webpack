<template>
    <div v-on:click.self="toggleChatbox" v-bind:class="{ mini: state.display == 'mini' }" id='socketchatbox-top'>
        <span v-on:click="toggleOnlineUsers" data-toggle="tooltip" data-placement="bottom" title='Users on this page' id='socketchatbox-online-usercount' class='badge'>{{socket.userCount}}
        </span>
        <div v-cloak v-show="state.display == 'full'" data-toggle="tooltip" data-placement="bottom" id='socketchatbox-username'>{{config.username}}</div>
        <span v-show="state.display == 'full'" id='topbar-options' class='float-right'>
            <span title='Comments' data-toggle="tooltip" data-placement="bottom" id='socketchatbox-comments'><font-awesome-icon icon="edit" class="fa fa-pencil" v-on:click='state.view=1' v-bind:class="{ selected: state.view==1 }" /></span>
            <span title='Live chat' data-toggle="tooltip" data-placement="bottom" id='socketchatbox-live'><font-awesome-icon icon="comments" class="fa fa-comments" v-on:click='state.view=2' v-bind:class="{ selected: state.view==2 }" /></span>
            <span title='Inbox' data-toggle="tooltip" data-placement="bottom" id='socketchatbox-inbox'><font-awesome-icon icon="inbox" class="fa fa-inbox" v-on:click='state.view=3' v-bind:class="{ selected: state.view==3 }" /></span>
            <span title='Profile' data-toggle="tooltip" data-placement="bottom" id='socketchatbox-profile'><font-awesome-icon icon="user-circle" class="fa fa-user" v-on:click='state.view=0' v-bind:class="{ selected: state.view==0 }" /></span>

            <font-awesome-icon v-on:click='hideChatbox' icon="times" class="fa fa-close" title='Close' data-toggle="tooltip" data-placement="bottom" id='socketchatbox-closeChatbox' />
        </span>
    </div>
</template>
<style>
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

#socketchatbox-online-usercount {
    line-height: 15px;
    color: white;
    background: #0089FF;
    display: inline-block;
    min-width: 10px;
    padding: 3px 7px;
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    margin-bottom: 2px;
    /* background-color: #777; */
    border-radius: 10px;
}

#socketchatbox-top {
  min-width: 100px;
  cursor: pointer;
  height: 30px;
  background: rgba(0, 0, 0, 0.75);
  padding-left: 10px;
  line-height: 30px;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

#socketchatbox-top.mini {
  background: rgba(255, 255, 255, 0.5);
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
            userCount: 1
        }
    },
    methods: {
        toggleOnlineUsers: function () {
            if (this.state.view != 2) {
                this.state.view = 2;
                this.state.showOnlineUsers = true;
            } else {
                this.state.showOnlineUsers = !this.state.showOnlineUsers;
            }
        },
        toggleChatbox: function () {
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
        hideChatbox: function () {
            // This is hiding entire iframe, not minimize
            // duplicate function in main.vue, should be the same
            this.state.display = 'hidden';
            chatboxUtils.updateIframeSize('close');
        }

    },
    created () {
    }
}
</script>
