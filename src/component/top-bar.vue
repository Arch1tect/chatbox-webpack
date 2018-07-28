<template>
    <div v-on:click.self="state.mini=!state.mini" v-bind:class="{ mini: state.mini }" id='socketchatbox-top'>
        <span data-toggle="tooltip" data-placement="bottom" title='User in this room' id='socketchatbox-online-usercount' class='badge'> 
        </span>
        <div v-show="!state.mini" data-toggle="tooltip" data-placement="bottom" title='Edit your name' id='socketchatbox-username'>{{username}}</div>
        <span v-show="!state.mini" id='topbar-options' class='float-right'>
            <span class="fa fa-pencil" title='Comments' data-toggle="tooltip" data-placement="bottom" id='socketchatbox-comments' v-on:click='state.view=1' v-bind:class="{ selected: state.view==1 }"></span>
            <span class="fa fa-comments" title='Live chat' data-toggle="tooltip" data-placement="bottom" id='socketchatbox-live' v-on:click='state.view=2' v-bind:class="{ selected: state.view==2 }"></span>
            <span class="fa fa-inbox" title='Inbox' data-toggle="tooltip" data-placement="bottom" id='socketchatbox-inbox' v-on:click='state.view=3' v-bind:class="{ selected: state.view==3 }"></span>
            <span class="fa fa-close" title='Close' data-toggle="tooltip" data-placement="bottom" id='socketchatbox-closeChatbox'></span>
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
#topbar-options span {
    color: lightgray;
    line-height: 30px;
    font-size: 20px;
    padding-left: 7px;
    padding-right: 7px;
}

#topbar-options span:hover{
  background: gray;;
  color:white;
}

#topbar-options span.selected{
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
import chatboxUIState from '../ui-state.js'
export default {
    name: 'top-bar',
    data () {
        return {
            username: 'Hello Vue!',
            state: chatboxUIState
        }
    }
}
</script>
