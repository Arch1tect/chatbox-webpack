<template>
    <div v-show="state.view==1">
        <div class="socketchatbox-page-title">
            <font-awesome-icon icon="sync-alt" v-bind:class="{fa: true, 'fa-refresh': true, 'fa-spin': loading }" v-on:click="userClickedRefresh" title='Refresh comments' data-toggle="tooltip" data-placement="bottom" id='socketchatbox-refresh-comments' />
            <span>{{title}}</span>
        </div>
        <div ref="commentArea" class="socketchatbox-commentsArea">
            <div v-for="msg in messages">
                <div class="comment-header socketchatbox-msg-username">
                    <span @click="viewUser(msg)"><img v-bind:src="msg.profileImgSrc" /><span class="commenter-name">{{msg.name}}</span></span><small>{{msg.time}}</small>
                </div>
                <div v-html="msg.content" class="comment-body"></div>
            </div>
        </div>
        <button v-show="state.view == 1" @click="chatboxUtils.openCommentModal" class="socketchatbox-bottom-btn-wrapper">
            <span>Add your comment</span>
        </button>
    </div>
</template>
<style>
.commenter-name {
  margin-left: 5px;
  cursor: pointer;
}
.socketchatbox-commentsArea {
  /*background: #fffdf0;*/
  overflow-wrap: break-word;
  width: 100%;
  height: calc(100% - 30px);
  overflow-y: auto; /*only show scroll bar when needs to*/
  padding-right: 10px;
  padding-left: 10px;
  padding-top: 30px;
}

.socketchatbox-commentsArea .comment-body {
  margin-top: 5px;
  width: auto;
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
.socketchatbox-commentsArea .comment-header small {
  color: gray;
  margin-left: 10px;
}
.socketchatbox-bottom-btn-wrapper {
  width: 100%;
  height: 35px;
  border: none;
  border-top: 1px solid lightgray;
  float: left;
  border-radius: 0;
  background: white;
  color: black;
  font-weight: 400;
}
.socketchatbox-bottom-btn-wrapper:hover {
  /*background:white;*/
  cursor: pointer;
}
.socketchatbox-bottom-btn-wrapper span.fa {
  margin-right: 5px; 
}
</style>
<script>
import * as moment from 'moment'
import Vue from 'vue'

import chatboxUIState from '../ui-state.js'
import chatboxConfig from '../config.js'
import chatboxUtils from '../utils.js'


"use strict";

var titleStr = 'Comments on this page';

export default {
    name: 'comment-body',
    data () {
        return {
            state: chatboxUIState,
            chatboxUtils: chatboxUtils,
            chatbox: chatboxConfig,
            lastCommentId: -1,
            loading: true,
            messages: [],
            title: titleStr,
            clearNoCommentMsgTimeout: null
        }
    },
    methods: {
        viewUser: function (msg) {
            chatboxUtils.viewOthersProfile(1, msg.user_id, msg.name);
        },
        scrollToBottom: function () {
            this.$refs.commentArea.scrollTop = this.$refs.commentArea.scrollHeight;
        },
        userClickedRefresh: function () {
            var _this = this;
            this.loadComments(function(data){
                if (!data.length) {
                    Vue.notify({
                      title: 'No new comments',
                    });
                    // _this.title = 'No new comment';
                    if (_this.clearNoCommentMsgTimeout)
                        clearTimeout(_this.clearNoCommentMsgTimeout);
                    _this.clearNoCommentMsgTimeout = setTimeout(function(){
                        _this.title = titleStr;
                    },2000);
                } else {
                    Vue.notify({
                      title: data.length + ' new comments',
                    });
                }
            });
        },
        loadComments: function (callback) {
            this.loading = true;
            var _this = this;

            $.get(chatbox.apiUrl + "/db/comments/offset/" + this.lastCommentId + "/url/" + chatbox.location).done(function(resp) {
                var index = 0;
                for (; index<resp.length; index++) {
                    var data = resp[index];
                    if (!data.name)
                        data.name = 'no name';
                    chatboxUtils.tryLoadingProfileImg(data, data.user_id);
                    data.time = moment.utc(data.created_time).fromNow();
                    _this.lastCommentId = data.id;
                    data.content = chatboxUtils.addClassToEmoji(data.content);
                    _this.messages.push(data);
                    chatboxUtils.queueDanmu(data);
                }
                Vue.nextTick(function(){
                    _this.scrollToBottom();
                });
                if (callback)
                    callback(resp);
            }).fail(function() {
                Vue.notify({
                  title: 'Fail to load comments',
                  type: 'error'
                });
            }).always(function(){
                _this.loading = false;
            });
        }
    },
    created () {
        this.loadComments();
        // Make the method accessible from comment modal
        chatboxUtils.loadComments = this.loadComments;
    }
}

</script>
