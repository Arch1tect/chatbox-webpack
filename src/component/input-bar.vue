<template>
    <div id="chatbox-input" v-show="state.view != 1" class = "socketchatbox-inputMessage-div">
        <div v-show="showStickers" id="socketchatbox-sticker-picker">
            <img v-on:click="sendSticker" src="stickers/bunny/hi.gif"/>
            <img v-on:click="sendSticker" src="stickers/bunny/yes.gif"/>
            <img v-on:click="sendSticker" src="stickers/bunny/cute.gif"/>
            <img v-on:click="sendSticker" src="stickers/bunny/rubber_face.gif"/>
            <img v-on:click="sendSticker" src="stickers/bunny/cheers.gif"/>
            <img v-on:click="sendSticker" src="stickers/bunny/together.gif"/>
            <img v-on:click="sendSticker" src="stickers/bunny/chase_butterfly.gif"/>
            <img v-on:click="sendSticker" src="stickers/bunny/heart.gif"/>
            <img v-on:click="sendSticker" src="stickers/bunny/happy_tear.gif"/>
            <img v-on:click="sendSticker" src="stickers/bunny/swim_in_tear.gif"/>
            <img v-on:click="sendSticker" src="stickers/bunny/rub_your_head.gif"/>
            <img v-on:click="sendSticker" src="stickers/bunny/no_way.gif"/>
            <img v-on:click="sendSticker" src="stickers/bunny/sad.gif"/>
            <img v-on:click="sendSticker" src="stickers/bunny/pro.gif"/>
            <img v-on:click="sendSticker" src="stickers/bunny/kiss.gif"/>
            <img v-on:click="sendSticker" src="stickers/bunny/kiss_face.gif"/>
            <img v-on:click="sendSticker" src="stickers/bunny/cute_baby.gif"/>
            <br/>
            <img v-on:click="sendSticker" src="stickers/seal/beat.gif"/>
            <img v-on:click="sendSticker" src="stickers/seal/cold.gif"/>
            <img v-on:click="sendSticker" src="stickers/seal/eat.gif"/>
            <img v-on:click="sendSticker" src="stickers/seal/hand_cold.gif"/>
            <img v-on:click="sendSticker" src="stickers/seal/kiss.gif"/>
            <img v-on:click="sendSticker" src="stickers/seal/miao.gif"/>
        </div>

        <emoji-picker v-bind:style="{ visibility: emojiPickerVisibility }" ref="emojiComponent" @emoji="addEmoji" :search="emojiSearch">
          <div slot="emoji-picker" slot-scope="{ emojis, insert, display }">
            <div class="emoji-picker" :style="{ bottom: '35px', 'max-height':'300px' }">
              <div class="emoji-picker__search">
                <input type="text" v-model="emojiSearch">
              </div>
              <div>
                <div v-for="(emojiGroup, category) in emojis" :key="category">
                  <h5>{{ category }}</h5>
                  <div class="emojis">
                    <span v-for="(emoji, emojiName) in emojiGroup" :key="emojiName" @click="insert(emoji)" :title="emojiName">{{ emoji }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </emoji-picker>

        <input autoFocus ref="chatInput" v-model="content"  v-on:keyup.enter="sendInput" class="socketchatbox-inputMessage" v-bind:placeholder="InputPlaceHolder"/>
        <label v-show="state.view==2" data-toggle="tooltip" title='Send image or file' data-placement="left" class="btn" id='socketchatbox-sendFileBtn' for = "socketchatbox-sendMedia">
            <input @change="sendFile" id="socketchatbox-sendMedia" type="file" style="display:none;">
        </label>
        <button @click="toggleEmoji" data-toggle="tooltip" title='Send emoji' id = "socketchatbox-emoji-btn"></button>
        <button v-on-clickaway="hideStickers" v-on:click="showStickers=!showStickers" data-toggle="tooltip" title='Send stickers' id = "socketchatbox-sticker-btn"></button>
    </div>
</template>
<style>
.socketchatbox-inputMessage-div {
  height: 35px; 
  background-color: white;
  border-top: 1px solid lightgray;
}
.socketchatbox-inputMessage {
    width: calc(100% - 105px);
    padding: 0px;
    padding-left: 10px;
    height: 34px;
    border: 0px;
    margin: 0px;
    line-height: 2;
    float: left;
}
input.socketchatbox-inputMessage:disabled {
    background: lightgray;
}
#socketchatbox-sendFileBtn {
  height: 34px; /*-1px for border-top*/
  width: 35px;
  float: right;
  background: transparent;
  /*background-image: url(send-file.png);*/
  background-repeat: no-repeat;
  background-position-x: 50%;
  color: white;
  overflow: hidden;
  filter: grayscale(100%);
  transform: scale(0.8);
  opacity: 0.7; /*because the other icon is too light*/
   margin: 0; 
  border-radius: 0px;
  /* padding: 0; */
}
#socketchatbox-emoji-btn {
  /*background: url(emoji.png) center center no-repeat;*/
  float: right;
  overflow: hidden;
  height: 34px;
  width: 35px;
  float: right;
  border: none;
  outline: none;
  background-color: transparent;
  filter: grayscale(100%);
  transform: scale(0.8);

}
#socketchatbox-sticker-btn {
  /*background: url(stickers.png) center center no-repeat;*/
  float: right;
  overflow: hidden;
  height: 34px;
  width: 35px;
  float: right;
  border: none;
  outline: none;
  background-color: transparent;
  filter: grayscale(100%);
  transform: scale(0.8);
  opacity: 0.5; /*because the other icon is too light*/

}
#socketchatbox-sticker-btn:hover {
  background-color:lightgray;
}
#socketchatbox-emoji-btn:hover {
  background-color:lightgray;
}
#socketchatbox-sendFileBtn:hover {
  background-color:lightgray;
}

#socketchatbox-sticker-picker {
    position: absolute;
    box-shadow: 0 0 7px #555;
    border-radius: 5px;
    z-index: 999999;
    bottom: 35px;
    overflow-x: hidden;
    overflow-y: overlay;
    height: 350px;
    width: 390px;
    padding: 5px;
    max-height: calc(100% - 65px);
    max-width: 100%;
    background: white;
    right: 0px;
}
#socketchatbox-sticker-picker img {
  width: 80px;
  margin:5px;
  cursor: pointer;
  border-radius: 5px;
}
#socketchatbox-sticker-picker img:hover {
  background: #e4e4e4;
}


/*====================================================
==========================Emoji=======================
======================================================*/
.emoji-picker {
    position: absolute;
    z-index: 999;
    font-family: Montserrat;
    border: 1px solid #ccc;
    width: 100%;
    /* height: 20rem; */
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 1rem;
    box-sizing: border-box;
    border-radius: 0.5rem;
    background: #fff;
    box-shadow: 1px 1px 8px #c7dbe6;
}
.emoji-picker__search {
  display: flex;
}
.emoji-picker__search > input {
  flex: 1;
  border-radius: 10rem;
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  outline: none;
}
.emoji-picker h5 {
  margin-bottom: 10px;
  color: #b1b1b1;
  text-transform: uppercase;
  font-size: 0.8rem;
  cursor: default;
}
.emoji-picker .emojis {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.emoji-picker .emojis:after {
  content: "";
  flex: auto;
}
.emoji-picker .emojis span {
    border-radius: 5px;
    padding: 3px;
    font-size: 25px;
    line-height: 25px;
}
.emoji-picker .emojis span:hover {
  background: #ececec;
  cursor: pointer;
}

</style>
<script>
import Vue from 'vue'
import { EmojiPickerPlugin } from 'vue-emoji-picker'
Vue.use(EmojiPickerPlugin)
import { mixin as clickaway } from 'vue-clickaway';

import chatboxUIState from '../ui-state.js'
import chatbox from '../config.js'
import chatboxUtils from '../utils.js'



export default {
    name: 'input-bar',
    data () {
        return {
            state: chatboxUIState,
            InputPlaceHolder: 'Type here...',
            content: '',
            emojiSearch: '',
            showStickers: false,
            emojiPickerVisibility: 'hidden',
        }
    },
    mixins: [clickaway],
    methods: {
        focusOnInput() {
            var _this = this;
            Vue.nextTick(function () {
                _this.$refs.chatInput.focus();
            });
        },
        refreshEmoji() {
            this.emojiPickerVisibility = 'hidden';
            var _this = this;
            setTimeout(function(){
                // put visible = true in setTimeout so it doesn't block rendering
                _this.$refs.emojiComponent.display.visible = true;
                setTimeout(function(){
                    // wait until emoji fully rendered then hide it
                    // and set visibility to be visible
                    _this.$refs.emojiComponent.hide();
                    _this.emojiPickerVisibility = 'visible';
                }, 100);
            }, 100);
        },
        toggleEmoji(e) {
            // bad practice but emoji library only support using slot
            this.$refs.emojiComponent.toggle(e);
        },
        addEmoji(emoji) {
            // add selected emoji to input also focus on input
            var inputSelectionStart = this.$refs.chatInput.selectionStart;
            var inputSelectionEnd = this.$refs.chatInput.selectionEnd;
            var inputString = this.content;
            this.content = inputString.substring(0, inputSelectionStart) + emoji 
            // emoji seems usually count as 2 characters
            inputSelectionStart = this.content.length;
            this.content += inputString.substring(inputSelectionEnd);
            var _this = this;
            Vue.nextTick(function () {
                _this.$refs.chatInput.selectionStart = inputSelectionStart;
                _this.$refs.chatInput.selectionEnd = inputSelectionStart;
                _this.focusOnInput();
            })
        },
        hideStickers: function () {
            this.showStickers = false;
        },
        sendLiveChatMsg: function (msg) {
            var data = {};
            data.username = chatbox.userName;
            data.msg = msg; //need to clean input!
            chatbox.socket.emit('new message', data);
        },
        sendInput: function () {
            // Fired when enter key pressed, handle differently depending on
            // whether it's live chat or private messaging
            if (this.state.view == 2)
                this.sendLiveChatMsg(this.content);
            else 
                chatbox.sendPM(this.content);

            this.content = '';
            this.$refs.emojiComponent.hide();
        },
        sendSticker: function (e) {
            var msg = e.target.getAttribute('src')
            if (this.state.view == 2)
                this.sendLiveChatMsg(msg);
            else
                chatbox.sendPM(msg);

            this.focusOnInput();
        },
        sendFile: function (e) {
            // Live chat only
            var data = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function(evt){
                var msg ={};
                msg.username = chatbox.userName;
                msg.file = evt.target.result;
                msg.fileName = data.name;
                chatbox.socket.emit('base64 file', msg);
            };
            reader.readAsDataURL(data);
        }
    },
    watch: {
        'state.mini': function (newVal, oldVal) {
            // emoji library is using v-if instead of v-show 
            // therefore first time loading is very slow, preload it
            // through hacky way
            // TODO: switch to other library
            // if (!newVal) {
            //     this.refreshEmoji();
            //     if (this.state.view !== 1)
            //         this.focusOnInput();
            // }
        },
        'state.view': function (newVal, oldVal) {
            if (newVal !== 1)
                this.focusOnInput()
        }
    },
    mounted () {
        // emoji library is using v-if instead of v-show 
        // therefore first time loading is very slow, preload it
        // through hacky way
        // TODO: switch to other library
        this.refreshEmoji();    
    }
}
</script>
