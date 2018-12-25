<template>
    <div id="chatbox-input" v-show="state.view == 2 || state.view==3" class = "socketchatbox-inputMessage-div">
        <div v-show="showStickers" id="socketchatbox-sticker-picker">
            <img v-for="sticker in stickers" v-on:click="sendSticker" v-bind:src="sticker" />
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

        <input :disabled="(state.view == 2 && !config.liveChatEnabled) || (state.view == 3 && !config.directMsgEnabled)" autoFocus ref="chatInput" v-model="content"  v-on:keyup.enter="sendInput" @keyup="typing" class="socketchatbox-inputMessage" v-bind:placeholder="InputPlaceHolder"/>
        <label v-show="state.view==2" data-toggle="tooltip" title='Send image or file' data-placement="left" id='socketchatbox-sendFileBtn' for = "socketchatbox-sendMedia">
            <font-awesome-icon icon="paperclip" style="width: 100%;height: 100%;"/>
            <input @change="sendFile" id="socketchatbox-sendMedia" type="file" style="display:none;">
        </label>
        <font-awesome-icon icon="smile" @click="toggleEmoji" data-toggle="tooltip" title='Send emoji' id = "socketchatbox-emoji-btn" />
        <font-awesome-icon icon="laugh-wink" v-on-clickaway="hideStickers" v-on:click="showStickers=!showStickers" data-toggle="tooltip" title='Send stickers' id = "socketchatbox-sticker-btn" />
    </div>
</template>
<style>
.socketchatbox-inputMessage-div .svg-inline--fa{
    padding: 7px;
    cursor: pointer;
}
.socketchatbox-inputMessage-div {
    height: 35px; 
    background-color: white;
    border-top: 1px solid lightgray;
    padding-right: 10px;
}
.socketchatbox-inputMessage-div input {
    box-sizing: border-box;
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
    cursor: not-allowed;
}
#socketchatbox-sendFileBtn {
    float: right;
    overflow: hidden;
    height: 34px;
    width: 35px;
    float: right;
    color: lightgrey;
    border: none;
    outline: none;
}
#socketchatbox-emoji-btn {
    float: right;
    overflow: hidden;
    height: 34px;
    width: 35px;
    float: right;
    color: lightgrey;
    border: none;
    outline: none;
}
#socketchatbox-sticker-btn {
    float: right;
    overflow: hidden;
    height: 34px;
    width: 35px;
    float: right;
    color: lightgrey;
    border: none;
    outline: none;
}
#socketchatbox-sticker-btn:hover {
    color: gray;
}
#socketchatbox-emoji-btn:hover {
    color: gray;
}
#socketchatbox-sendFileBtn:hover {
    color: gray;
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
  width: 70px;
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
import chatboxConfig from '../config.js'
import chatboxUtils from '../utils.js'
import chatboxSocket from '../socket.js'


export default {
    name: 'input-bar',
    data () {
        return {
            state: chatboxUIState,
            config: chatboxConfig,
            InputPlaceHolder: this.$t('m.typeHere'),
            content: '',
            emojiSearch: '',
            showStickers: false,
            emojiPickerVisibility: 'hidden',
            stickers: []
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
            data.username = chatboxConfig.username;
            data.msg = msg; //need to clean input!
            chatboxSocket.getSocket().emit('new message', data);
        },
        typing: function (e) {
            if (this.state.view !== 2) return;

            if (e.key == "Enter") {
            chatboxSocket.getSocket().emit('stop typing', {username: chatboxConfig.username});
            } else {
                chatboxSocket.getSocket().emit('typing', {username: chatboxConfig.username});
            }
        },
        sendInput: function () {
            // Fired when enter key pressed, handle differently depending on
            // whether it's live chat or private messaging
            if (!this.content) return;
            if (this.content.length > 150) {
                Vue.notify({
                    title: this.$t('e.inputTooLong'),
                    type: 'error'
                });
                return;
            }

            if (this.state.view == 2)
                this.sendLiveChatMsg(this.content);
            else 
                chatboxUtils.sendPM(this.content);

            this.content = '';
            this.$refs.emojiComponent.hide();
        },
        sendSticker: function (e) {
            var msg = e.target.getAttribute('src')
            if (this.state.view == 2)
                this.sendLiveChatMsg(msg);
            else
                chatboxUtils.sendPM(msg);

            this.focusOnInput();
        },
        sendFile: function (e) {
            // Live chat only
            var data = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function(evt){
                var msg ={};
                msg.username = chatboxConfig.username;
                msg.file = evt.target.result;
                msg.fileName = data.name;
                chatboxSocket.getSocket().emit('base64 file', msg);
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
            // Above is causing maximize animation to jump, therefore commented out
        },
        'state.view': function (newVal, oldVal) {
            if (newVal !== 1)
                this.focusOnInput()
        }
    },
    created () {
        this.stickers = [
            "stickers/bunny/hi.gif",
            "stickers/bunny/yes.gif",
            "stickers/bunny/ok.gif",
            "stickers/bunny/rubber_face.gif",
            "stickers/bunny/cheers.gif",
            "stickers/bunny/together.gif",
            "stickers/bunny/chase_butterfly.gif",
            "stickers/bunny/heart.gif",
            "stickers/bunny/happy_tear.gif",
            "stickers/bunny/swim_in_tear.gif",
            "stickers/bunny/rub_your_head.gif",
            "stickers/bunny/no_way.gif",
            "stickers/bunny/sad.gif",
            "stickers/bunny/pro.gif",
            "stickers/bunny/kiss.gif",
            "stickers/bunny/kiss_face.gif",
            "stickers/bunny/cute_baby.gif",
            "stickers/bunny/cute.gif",
            "stickers/bunny/excited.gif",
            "stickers/bunny/good_night.gif",
            "stickers/bunny/haha.gif",
            "stickers/bunny/sheishei.gif",
            "stickers/bunny/you_are_best.gif",

            "stickers/seal/beat.gif",
            "stickers/seal/cold.gif",
            "stickers/seal/eat.gif",
            "stickers/seal/hand_cold.gif",
            "stickers/seal/kiss.gif",
            "stickers/seal/miao.gif",
            "stickers/seal/kiss_face.gif",
            "stickers/seal/mad.gif",
            "stickers/seal/come_sleep.gif",
            "stickers/seal/happy.gif",
        ];
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
