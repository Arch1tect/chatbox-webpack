<template>
    <div v-show="state.view==1" class="socketchatbox-comments">
        <div class="socketchatbox-page-title">
            <font-awesome-icon icon="sync-alt" v-bind:class="{fa: true, 'fa-refresh': true, 'fa-spin': loading }" v-on:click="userClickedRefresh" title='Refresh comments' data-toggle="tooltip" data-placement="bottom" id='socketchatbox-refresh-comments' />
            <span>{{title}}</span>
        </div>
        <div ref="commentArea" class="socketchatbox-commentsArea">
            <div v-for="msg in messages">
                <div class="comment-header socketchatbox-msg-username">
                    <span @click="viewUser(msg)">{{msg.name}}</span><small>{{msg.time}}</small>
                </div>
                <div v-html="msg.content" class="comment-body"></div>
            </div>
        </div>
    </div>
</template>
<style>
.socketchatbox-comments {
  width: 100%;
  height: 100%;
  background: #eceff1;
}
.socketchatbox-commentsArea {
  overflow-wrap: break-word;
  width: 100%;
  height: calc(100% - 30px);
  overflow-y: auto; /*only show scroll bar when needs to*/
  border: none; 
  padding-right: 10px;
  padding-left: 10px;
  padding-top: 30px;
}

.socketchatbox-commentsArea .comment-body {
  margin-top: 5px;
  white-space: pre-line;
  display: inline-block;
  margin-bottom: 15px;
  max-width: 85%;
  background-color: #FFFFFF;
  border-radius: 5px;
  box-shadow: 0 0 6px #B2B2B2;
  padding: 10px 18px;
  vertical-align: top;
  line-height: 1.25em;
  font-size: 12px;
  word-wrap: break-word;
  background: white;
}

.socketchatbox-commentsArea .comment-header span {
  margin: 3px;
}

.socketchatbox-commentsArea .comment-header small {
  color: gray;
  margin-left: 10px;
}
</style>
<script>
import * as moment from 'moment'

import chatboxUIState from '../ui-state.js'
import chatbox from '../config.js'
import chatboxUtils from '../utils.js'


"use strict";

var titleStr = 'Comments on this page';

export default {
    name: 'comment-body',
    data () {
        return {
            state: chatboxUIState,
            chatbox: chatbox,
            lastCommentId: -1,
            loading: true,
            messages: [],
            title: titleStr,
            clearNoCommentMsgTimeout: null
        }
    },
    methods: {
        viewUser: function (msg) {
            chatbox.goToMessage(msg.user_id, msg.name);
        },
        scrollToBottom: function () {
            this.$refs.commentArea.scrollTop = this.$refs.commentArea.scrollHeight;
        },
        userClickedRefresh: function () {
            var _this = this;
            this.loadComments(function(data){
                if (!data.length) {
                    _this.title = 'No new comment';
                    if (_this.clearNoCommentMsgTimeout)
                        clearTimeout(_this.clearNoCommentMsgTimeout);
                    _this.clearNoCommentMsgTimeout = setTimeout(function(){
                        _this.title = titleStr;
                    },2000);
                }
            });
        },
        loadComments: function (callback) {
            this.loading = true;
            var _this = this;
            $.get(chatbox.commentUrl + "/db/comments/offset/" + this.lastCommentId + "/url/" + chatbox.location, function(resp) {
                var index = 0;
                for (; index<resp.length; index++) {
                    var data = resp[index];
                    if (!data.name)
                        data.name = 'no name';

                    data.time = moment.utc(data.created_time).fromNow();
                    _this.lastCommentId = data.id;
                    data.content = chatboxUtils.addClassToEmoji(data.content);
                    _this.messages.push(data);
                }
                if (callback)
                    callback(resp);
                chatbox.addMsgsToDanmu(resp);
            }).always(function(){
                _this.loading = false;
            });
        }
    },
    created () {
        this.loadComments();
        // Make the method accessible from comment modal
        chatbox.loadComments = this.loadComments;
    }
}

</script>
