<template>
    <div v-show="state.view==1">
        <div class="socketchatbox-page-title">
            <font-awesome-icon icon="sync-alt" v-bind:class="{fa: true, 'fa-refresh': true, 'fa-spin': loading }" v-on:click="userClickedRefresh" title='Refresh comments' data-toggle="tooltip" data-placement="bottom" id='socketchatbox-refresh-comments' />
            <span>{{chatbox.commentsTotal}} comments on this page.</span>
        </div>
        <div ref="commentArea" class="socketchatbox-commentsArea">
            <div v-for="msg in messages" v-bind:class="{'from-self': msg.fromSelf}">
                <img class="user-avatar" @click="viewUser(msg)" v-bind:src="msg.profileImgSrc" />
                <div class="comment-body">
                  <small class="commenter-name">{{msg.name}}</small><small class="comment-time">{{msg.time}}</small>
                  <div class="comment-content" v-html="msg.content"></div>
                  <br />
                  <div class="comment-body-footer">
                    <span @click="vote(msg, 1)" v-bind:class="{voted: msg.voted == 1 }"><font-awesome-icon :icon="['fas', 'thumbs-up']" class="fa fa-thumbs-up" /></span>
                    <span v-if="msg.score!=0" class="comment-score">{{msg.score}}</span>
                    <span @click="vote(msg, -1)" v-bind:class="{voted: msg.voted == -1 }"><font-awesome-icon :icon="['fas', 'thumbs-down']" class="fa fa-thumbs-down" /></span>
                    <span class='reply'>Reply</span>
                    <!-- <span class="flag" title="flag as inappropriate"><font-awesome-icon :icon="['fas', 'flag']" class="fa fa-flag" /></span> -->
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
  margin-right: 5px;
  /*font-size: larger;*/
  color: #aaaaaa;
  cursor: pointer;
}
.comment-body-footer .flag {
  float: right;
}
.comment-body-footer span.comment-score {
  color: #03a9f4;
}
.comment-body-footer span.voted {
  color: #03a9f4 !important;
}
.comment-body-footer span:hover {
  color: gray;
}
.comment-body-footer span.flag:hover {
  color: red;
}
.commenter-name {
  font-weight: bold;
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
  padding-bottom: 7px;
  vertical-align: top;
  line-height: 1.25em;
  font-size: 12px;
  word-wrap: break-word;
  background: white;
}

.from-self .comment-body {
  /*background: #BBFF00;*/
  /*TODO: better way to highlight own comment;*/
}

</style>
<script>
import * as moment from 'moment'
import Vue from 'vue'

import chatboxUIState from '../ui-state.js'
import chatboxConfig from '../config.js'
import chatboxUtils from '../utils.js'


"use strict";

export default {
    name: 'comment-body',
    data () {
        return {
            state: chatboxUIState,
            chatboxUtils: chatboxUtils,
            chatbox: chatboxConfig,
            lastCommentId: -1,
            loading: true,
            messages: []
        }
    },
    methods: {
        vote: function (msg, vote) {

            if (msg.voted) {
              if (msg.voted == vote) {
                // if voted then cancel the vote
                // TODO: implement cancel vote in backend
                msg.voted = null;
                msg.score -= vote;
                return;
              } else {
                // if voting opposite now, need to count vote twice
                msg.score += vote;
              }
            }

            msg.voted = vote;
            msg.score += vote;
            var payload = {
                'user_id': chatboxConfig.userId,
                'vote': vote
            }
            $.post(chatboxConfig.apiUrl + "/db/comment/"+ msg.id+"/vote", payload, function(resp) {
            }).fail(function(){
                Vue.notify({
                  title: 'Vote failed',
                  type: 'error'
                });
            });
        },
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
        sortComemnts: function (comments) {
          comments.sort(function(a, b){
            if (!a.score) a.score = 0;
            if (!b.score) b.score = 0;
            if (a.score!=b.score) {
              if (a.score > b.score) return -1;
              else return 1;
            }
            if (a.created_time > b.created_time)
              return -1;
            else
              return 1;
          });
        },
        loadComments: function (callback) {
            this.loading = true;
            var _this = this;

            $.get(chatbox.apiUrl + "/db/comments_with_votes/offset/" + this.lastCommentId + "/user_id/" + chatboxConfig.userId + "/url/" + chatbox.location).done(function(resp) {
                chatboxConfig.commentsTotal = resp.length;
                _this.sortComemnts(resp);
                var index = 0;
                for (; index<resp.length; index++) {
                    var data = resp[index];
                    if (!data.name)
                        data.name = 'no name';
                    chatboxUtils.tryLoadingProfileImg(data, data.user_id);
                    data.time = moment.utc(data.created_time).fromNow();
                    _this.lastCommentId = Math.max(_this.lastCommentId, data.id);
                    data.content = chatboxUtils.addClassToEmoji(data.content);
                    _this.messages.push(data);
                    data.fromSelf = data.user_id == chatboxConfig.userId
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
        // Make the method accessible from comment modal
        chatboxUtils.loadComments = this.loadComments;
    }
}

</script>
