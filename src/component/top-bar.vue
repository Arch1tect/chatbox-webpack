<template>
    <div v-on:click.self="toggleChatbox" v-bind:class="{ mini: state.display == 'mini' }" id='socketchatbox-top'>
        <span data-toggle="tooltip" data-placement="bottom" title='User in this room' id='socketchatbox-online-usercount' class='badge'>{{socket.userCount}}
        </span>
        <div v-cloak v-show="state.display == 'full'" data-toggle="tooltip" data-placement="bottom" title='Edit your name' id='socketchatbox-username'>{{config.username}}</div>
        <span v-show="state.display == 'full'" id='topbar-options' class='float-right'>
            <span title='Comments' data-toggle="tooltip" data-placement="bottom" id='socketchatbox-comments'><font-awesome-icon icon="edit" class="fa fa-pencil" v-on:click='state.view=1' v-bind:class="{ selected: state.view==1 }" /></span>
            <span title='Live chat' data-toggle="tooltip" data-placement="bottom" id='socketchatbox-live'><font-awesome-icon icon="comments" class="fa fa-comments" v-on:click='state.view=2' v-bind:class="{ selected: state.view==2 }" /></span>
            <span title='Inbox' data-toggle="tooltip" data-placement="bottom" id='socketchatbox-inbox'><font-awesome-icon icon="inbox" class="fa fa-inbox" v-on:click='state.view=3' v-bind:class="{ selected: state.view==3 }" /></span>
            <font-awesome-icon icon="times" class="fa fa-close" title='Close' data-toggle="tooltip" data-placement="bottom" id='socketchatbox-closeChatbox' />
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

.socketchatbox-onlineusers {
  background: rgba(77, 172, 255, 0.8);
  outline: 1px solid rgba(77, 172, 255, 0.8);
  padding: 5px;
  width: 100%;
  position: absolute;
  display: none;
  z-index: 1;
}

.socketchatbox-onlineusers span{

  display: inline-block;
  padding: 5px;
  color: #FFF;
}

#socketchatbox-top {
  min-width: 100px;
  cursor: pointer;
  height: 30px;
  background: rgba(0, 0, 0, 0.75);
  padding-left: 10px;
  line-height: 30px;
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
            socket: chatboxSocket
        }
    },
    methods: {
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
        }

    },
    created () {
        var _this = this;
        chatboxSocket.registerCallback('user joined', function (data) {
            chatboxSocket.userCount = data.numUsers;
        });
        chatboxSocket.registerCallback('user left', function (data) {
            chatboxSocket.userCount = data.numUsers;
        });
        chatboxSocket.registerCallback('welcome new user', function (data) {
            var userCount = 0;
            for (var onlineUsername in data.onlineUsers){
                userCount++;
            }
            chatboxSocket.userCount = userCount;
        });
        chatboxSocket.registerCallback('welcome new connection', function (data) {
            var userCount = 0;
            for (var onlineUsername in data.onlineUsers){
                userCount++;
            }
            chatboxSocket.userCount = userCount;
        });

    }
}
</script>
