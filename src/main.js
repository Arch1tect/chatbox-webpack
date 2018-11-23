import Vue from 'vue'
import Notifications from 'vue-notification'
Vue.use(Notifications)
import VModal from 'vue-js-modal'
Vue.use(VModal, { componentName: "vue-modal" })
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

import chatboxMainVue from './main.vue'
import commentModal from './comment-modal.vue'
import topBar from './component/top-bar.vue'
import chat from './component/chat.vue'
import inbox from './component/inbox.vue'
import inputBar from './component/input-bar.vue'
import comment from './component/comment.vue'
import profile from './component/profile.vue'
import othersProfile from './component/others-profile.vue'
import onlineUsers from './component/online-users.vue'
import invitations from './component/invitations.vue'

Vue.component('top-bar', topBar);
Vue.component('chat-body', chat);
Vue.component('inbox-body', inbox);
Vue.component('comment-body', comment);
Vue.component('profile-body', profile);
Vue.component('others-profile', othersProfile);
Vue.component('input-bar', inputBar);
Vue.component('online-users', onlineUsers);
Vue.component('invitations', invitations);

// fontawesome start
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBullhorn, faBroadcastTower, faUsers, faPowerOff, faCommentAlt, faReply, faThumbsUp, faThumbsDown, faFlag, faArrowAltCircleLeft, faLongArrowAltLeft, faUser, faUserCircle, faSyncAlt, faSmile, faLaughWink, faComments, faPaperclip, faInbox, faPen, faTimes, faWindowClose } from '@fortawesome/free-solid-svg-icons'
// import { faHandshake } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faArrowAltCircleLeft)
library.add(faLongArrowAltLeft)
library.add(faBullhorn)
library.add(faBroadcastTower)
library.add(faUser)
library.add(faUsers)
library.add(faUserCircle)
library.add(faSyncAlt)
library.add(faComments)
library.add(faPen)
library.add(faSmile)
library.add(faTimes)
library.add(faPaperclip)
library.add(faLaughWink)
library.add(faWindowClose)
library.add(faInbox)
library.add(faReply)
library.add(faFlag)
library.add(faThumbsUp)
library.add(faThumbsDown)
library.add(faCommentAlt)
library.add(faPowerOff)
Vue.component('font-awesome-icon', FontAwesomeIcon)
// fontawesome end


// Ready translated locale messages
const messages = {
  en: {
    m: {
      redirecting: 'Redirecting you now...',
      commentTab: 'Comment',
      chatTab: 'Live chat',
      inboxTab: 'Inbox',
      profileTab: 'Profile',
      close: 'Close',
      cancel: 'Cancel',
      submit: 'Submit!',
      submitted: 'Submitted!',
      submitCommentFailed: 'Fail to leave comment!',
      connect: 'Join live chat!',
      connected: 'Connected!',
      connecting: 'Connecting...',
      disconnect: 'Disconnect',
      disconnected: 'Disconnected!',
      online: 'Online',
      offline: 'Offline',
      loading: 'Loading...',
      invite: 'Invite more people to this page!',
      invitations: 'Invitations',
      onlineUsers: 'Users on this page',
      noInvitation: 'No invitation received',
      typeHere: 'Type here...',
      joinMe: 'Join me at',
      liveChatWelcomeLog: 'Live chat with other people on this page',
      comment: 'Leave a comment!',
      commentsTotal: '{num} comments',
      startConversation: 'Start the conversation now!',
      conversationWith: 'Conversation with',
      conversationWithAfter: '',
      userNotFound: 'User not found',
      userLoadFailed: 'Failed to load profile',
      update: 'Update',
      updating: 'Updating...',
      nameUpdated: 'Name updated!',
      nameUpdateFailed: 'Failed to update name',
      introductionUpdated: 'Introduction updated!',
      introductionUpdateFailed: 'Failed to save introduction',
      profileImageUpdated: 'Profile image saved!',
      profileImageUpdateFailed: 'Failed to save profile image',
      aboutMe: 'Introduce yourself here...',
      displayName: 'Display name',
      selfProfile: 'Profile',
      othersProfile: '{username}\'s profile',
      sendPrivateMessage: 'Message',
      leaveFirstComment: 'Leave the first comment!',
      uploadProfileImage: 'Upload profile picture',
      goForum: 'Go to the forum!',
      chatbotName: 'Chat Bot',
      commentPlaceholder: 'Add your comment here...',
      replyTo: "Reply to ",
      reply: "Reply",
      voteFailed: 'Vote failed!',
      noNewComment: 'No new comment',
      noNewMessage: "No new message",
      newComment: 'new comment',
      newMessage: 'new message',
      loadMessageFailed: 'Failed to check new message',
      loadCommentFailed: 'Failed to load comments',
      invitationSent: 'Invitation sent!',
      welcomeInstall: 'Welcome to use this extension!',
      welcomeFromBot: "Welcome! Thank you for using this extension and please feel free to send us feedback! ;)"
    }
  },
  zh: {
    m: {
      redirecting: '跳转中。。。',
      commentTab: '留言板',
      chatTab: '在线聊天',
      inboxTab: '私信',
      profileTab: '个人资料',
      close: '关闭',
      cancel: '取消',
      submit: '提交!',
      submitted: '提交成功!',
      submitCommentFailed: '提交失败',
      connect: '连线！',
      connecting: '连线中。。。',
      connected: '已上线！',
      disconnect: '断开连接',
      disconnected: '已断线！',
      online: '在线',
      offline: '离线',
      loading: '载入中。。。',
      invite: '邀请更多人来当前网页！',
      invitations: '邀请',
      onlineUsers: '在当前页面的用户',
      noInvitation: '没有收到任何邀请',
      typeHere: '输入。。。',
      joinMe: '邀请你去',
      liveChatWelcomeLog: '和当前页面的用户在线聊天',
      comment: '留言！',
      commentsTotal: '{num} 条留言',
      startConversation: '开始私聊吧！',
      conversationWith: '和',
      conversationWithAfter: '的对话',
      userNotFound: '找不到该用户',
      userLoadFailed: '无法读取用户信息',
      update: '更新',
      updating: '更新中。。。',
      nameUpdated: '用户名已更新!',
      nameUpdateFailed: '用户名更新失败',
      introductionUpdated: '自我介绍已更新!',
      introductionUpdateFailed: '自我介绍更新失败',
      profileImageUpdated: '头像已更新!',
      profileImageUpdateFailed: '头像更新失败',
      aboutMe: '自我介绍。。。',
      displayName: '用户名',
      selfProfile: '个人资料',
      othersProfile: '{username} 的个人资料',
      sendPrivateMessage: '发私信',
      leaveFirstComment: '快来抢占沙发！',
      uploadProfileImage: '上传头像',
      goForum: '访问官方论坛',
      chatbotName: '小助手',
      commentPlaceholder: '留下你的评论。。。',
      replyTo: '回复',
      reply: '回复',
      voteFailed: '投票失败！',
      noNewComment: '没有新留言',
      noNewMessage: '没有新消息',
      newComment: '条新留言',
      newMessage: '条新消息',
      loadCommentFailed: '读取留言失败',
      loadMessageFailed: '读取信息失败',
      invitationSent: '邀请发送！',
      welcomeInstall: '欢迎使用这款插件!',
      welcomeFromBot: '欢迎使用这款插件! 请访问官方论坛给我们留言提建议！'
    }
  }
}

import * as moment from 'moment';
var lng = window.navigator.userLanguage || window.navigator.language;
var vueLng = 'en';
if (lng.indexOf('zh')>-1) {
	moment.locale('zh-cn');
	vueLng = 'zh';
}
// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: vueLng, // set locale
  messages, // set locale messages
})

new Vue({
  el: '#comment-modal',
  i18n,
  render: h => h(commentModal)
})

new Vue({
  el: '#chatbox',
  i18n,
  render: h => h(chatboxMainVue)
})
