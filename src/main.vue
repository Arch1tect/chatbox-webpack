<template>
    <div id="chatbox-main-vue">

        <div id="socketchatbox-all" class="socketchatbox-page">
            <div id="socketchatbox-ne" class="socketchatbox-resize"></div>
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
.socketchatbox-page {
    border: 1px solid lightgray;
    position: fixed;
    bottom:0px;
    box-shadow: 15px 15px 5px rgba(0, 0, 0, 0.31);
    font-family:Arial,Helvetica,sans-serif;
    font-size:12px;
    line-height: 1;
}

.socketchatbox-page-title {
  height: 30px;
  padding: 10px;
  border-bottom: 1px solid lightgray;
  width: 100%;
  text-align: center;
  background: white;
}
.socketchatbox-page-title span.fa {
    margin-right: 10px;
    cursor: pointer;
}

.socketchatbox-chatroom-wrapper {
  height: 100%;
  background: #eceff1;
}
/*[v-cloak] { display:none; }*/
/* Let's get this party started */
::-webkit-scrollbar {
    width: 5px;
}
 
/* Track */
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 1px lightgray; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.1); 
    /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); */
}
::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(0,0,0,0.05); 
}
</style>
<script>
import chatboxUIState from './ui-state.js'
import chatbox from './config.js'

export default {
    name: 'chatbox-main-vue',
    data () {
        return {
            state: chatboxUIState,
            height: 350,
            width:350
        }
    }
}
</script>
