<template>
    <div v-show="state.view==1">
        <div class="socketchatbox-page-title">
            <font-awesome-icon icon="sync-alt" v-bind:class="{fa: true, 'fa-refresh': true, 'fa-spin': loading }" v-on:click="userClickedRefresh" title='Refresh comments' data-toggle="tooltip" data-placement="bottom" id='socketchatbox-refresh-comments' />
            <span>{{title}}</span>
        </div>
        <div ref="commentArea" class="socketchatbox-commentsArea">
            <div v-for="msg in messages">
                <img class="user-avatar" @click="viewUser(msg)" v-bind:src="msg.profileImgSrc" />
                <div class="comment-body">
                  <span class="commenter-name">{{msg.name}}</span><small class="comment-time">{{msg.time}}</small>
                  <div class="comment-content" v-html="msg.content"></div>
                  <br />
                  <div class="comment-body-footer">
                    <span><font-awesome-icon :icon="['fas', 'thumbs-up']" class="fa fa-thumbs-up" /></span>           
                    <span class='reply'>Reply</span>
                    <span class="flag" title="flag as inappropriate"><font-awesome-icon :icon="['fas', 'flag']" class="fa fa-flag" /></span>
                  </div>
                </div>
            </div>
        </div>
        <button v-show="state.view == 1" @click="chatboxUtils.openCommentModal" class="socketchatbox-bottom-btn-wrapper">
            <span>Leave a comment</span>
        </button>
    </div>
</template>
<style>
.comment-body-footer span {
  margin-right: 10px;
  /*font-size: larger;*/
  color: #aaaaaa;
  cursor: pointer;
}
.comment-body-footer .flag {
  float: right;
}
.comment-body-footer span:hover {
  color: gray;
}
.comment-body-footer span.flag:hover {
  color: red;
}
.commenter-name {
  /*font-weight: bold;*/
}
.user-avatar {
  float: left;
}
.comment-content {
  margin-top: 5px;
}
.comment-time {
  color: gray;
  margin-left: 10px;
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
  width: auto;
  margin-left: 10px;
  white-space: pre-line;
  display: inline-block;
  margin-bottom: 15px;
  max-width: calc(100% - 50px);
  border-radius: 5px;
  box-shadow: 0 0 6px #B2B2B2;
  padding: 12px;
  padding-top: 7px;
  vertical-align: top;
  line-height: 1.25em;
  font-size: 12px;
  word-wrap: break-word;
  background: white;
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
                      title: 'No new comment',
                    });
                } else {
                    Vue.notify({
                      title: data.length + ' new comment',
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
                    // chatboxUtils.queueDanmu(data);
                }
                Vue.nextTick(function(){
                    _this.scrollToBottom();
                });
                if (callback)
                    callback(resp);
            }).fail(function() {
                Vue.notify({
                  title: 'Failed to load comments',
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
