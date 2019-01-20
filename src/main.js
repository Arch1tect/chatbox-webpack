import Vue from 'vue'
import Notifications from 'vue-notification'
Vue.use(Notifications)
import VModal from 'vue-js-modal'
Vue.use(VModal, { componentName: "vue-modal" })
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

import chatboxMainVue from './main.vue'
import commentModal from './comment-modal.vue'
import imageModal from './image-modal.vue'
import topBar from './component/top-bar.vue'
import chat from './component/chat.vue'
import inbox from './component/inbox.vue'
import inputBar from './component/input-bar.vue'
import comment from './component/comment.vue'
import profile from './component/profile.vue'
import othersProfile from './component/others-profile.vue'
import onlineUsers from './component/online-users.vue'
import invitations from './component/invitations.vue'
import followers from './component/followers.vue'

Vue.component('top-bar', topBar);
Vue.component('chat-body', chat);
Vue.component('inbox-body', inbox);
Vue.component('comment-body', comment);
Vue.component('profile-body', profile);
Vue.component('others-profile', othersProfile);
Vue.component('followers-body', followers);

Vue.component('input-bar', inputBar);
Vue.component('online-users', onlineUsers);
Vue.component('invitations', invitations);

// fontawesome start
import { library } from '@fortawesome/fontawesome-svg-core'
import { faWindowMinimize, faBullhorn, faBroadcastTower, faUsers, faPowerOff, faCommentAlt, faReply, faThumbsUp, faThumbsDown, faFlag, faArrowAltCircleLeft, faLongArrowAltLeft, faUser, faUserCircle, faSyncAlt, faSmile, faLaughWink, faComments, faPaperclip, faInbox, faPen, faTimes, faWindowClose } from '@fortawesome/free-solid-svg-icons'
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
library.add(faWindowMinimize)
Vue.component('font-awesome-icon', FontAwesomeIcon)
// fontawesome end


// Ready translated locale messages
const messages = {
  en: {
    400: 'Forbidden',
    401: 'Please login again',
    500: 'Failure',
    426: 'Please upgrade extension',
    429: 'Slow down please',
    4001: 'Insufficient credits',
    e: {
      passwordTooShort: 'Password length must be more than 8 characters',
      passwordNotMatch: 'Password does not match',
      inputTooLong: 'Please send no more than 150 words',
      loginFailed: 'Login failed',
      userNotFound: 'User not found',
      wrongPassword: 'Wrong password',
      wrongToken: 'Session expired, please login again'
    },
    m: {
      loadChatHistory: 'Load chat history',
      passwordUpdated: 'Password updated',
      showChangePasswordForm: 'Change password',
      confirmNewPassword: 'Confirm password',
      newPassword: 'New password',
      userNumId: 'User ID',
      password: 'Password',
      login: 'Login',
      loggingIn: 'Logging in...',
      loginSuccess: 'Login success',
      logoutSuccess: 'Log out success',
      logoutFailed: 'Log out failed',
      logout: 'Log out',
      changeNameTo: 'changed name to',
      chatHistoryAbove: 'Chat history above',
      minimize: 'Minimize',
      urlChanged: 'Url has changed, joining new page chat in {countDown} seconds...',
      foundSamePage:'Found other users on the same page, joining same page chat in {countDown} seconds...',
      stayHere: 'No, please stay here',
      goAhead: 'OK, switch now',
      success: 'Success',
      failed: 'Failed',
      follow: 'Follow',
      unfollow:'Unfollow',
      followers: 'followers',
      followerCount: 'Followers',
      followingCount: 'Following',
      cost: 'Cost',
      credit: 'Credit',
      checkinFailed: 'Failed to check in',
      avatarTooBig: 'Image must be smaller than',
      fileTooBig: 'File must be smaller than',
      redirecting: 'Redirecting you now...',
      commentTab: 'Comment',
      chatTab: 'Live chat',
      inboxTab: 'Inbox',
      profileTab: 'Profile',
      close: 'Close',
      cancel: 'Cancel',
      submit: 'Submit!',
      submitting: 'Submitting...',
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
      invite: 'Invite',
      everybody: 'everybody',
      sameSitePeople: 'same site users',
      invitations: 'Invitations',
      onlineUsers: 'Users on this page',
      sameSiteChatTitle: 'Chat with other people on this website',
      noInvitation: 'No invitation received',
      toggleSamePageChat: 'Choose same page chat or same site chat',
      toggleSamePageChatING: 'Switching...',
      samePageChat: 'Page',
      sameSiteChat: 'Site',
      typeHere: 'Type here...',
      joinMe: 'Join me at',
      liveChatWelcomeLog: 'Live chat with other people on this page',
      liveChatWelcomeLogSameSite: 'Live chat with other people on this website',
      comment: 'Leave a comment!',
      commentsTotal: '{num} comments',
      startConversation: 'Start the conversation now!',
      conversationWith: 'Conversation with',
      conversationWithAfter: '',
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
      sendingInvitation: 'Sending invitation...',
      invitationSent: 'Invitation sent',
      numUserReceived: 'followers received',
      welcomeInstall: 'Welcome to use this extension!',
      registerFailed: 'Failed to register, please refresh',
      welcomeFromBot: "Welcome! Thank you for using this extension and please feel free to send us feedback! ;)"
    }
  },
  zh: {
    400: '禁止通行',
    401: '请重新登录',
    500: '失败',
    426: '请更新插件',
    429: '请放慢速度',
    4001: '积分不足',
    e: {
      passwordTooShort: '密码长度需至少8个字符',
      passwordNotMatch: '确认密码不符',
      inputTooLong: '请减少到150字以内',
      loginFailed: '登录失败',
      userNotFound: '找不到该用户',
      wrongPassword: '密码错误',
      wrongToken: '请重新登录'
    },
    m: {
      loadChatHistory: '载入聊天记录',
      passwordUpdated: '密码已更新',
      showChangePasswordForm: '修改密码',
      confirmNewPassword: '确认密码',
      newPassword: '新密码',
      userNumId: '账号',
      password: '密码',
      login: '登录',
      loggingIn: '登录中。。。',
      loginSuccess: '登录成功！',
      logoutSuccess: '登出成功！',
      logoutFailed: '登出失败',
      logout: '登出',
      changeNameTo: '改名为',
      chatHistoryAbove: '以上为聊天记录',
      minimize: '最小化',
      urlChanged: '网页url地址改变, {countDown}秒后进入新聊天室。。。',
      foundSamePage:'发现同网页用户, {countDown}秒后进入同网页聊天。。。',
      stayHere: '不，请留在当前聊天室',
      goAhead: '好，立刻切换',
      success: '成功！',
      failed:'失败',
      follow: '关注',
      unfollow:'取消关注',
      followerCount: '关注者',
      followers: '关注者',
      followingCount: '关注了',
      cost: '消耗',
      credit: '积分',
      checkinFailed: '报道失败',
      avatarTooBig: '图片必须小于',
      fileTooBig: '文件必须小于',
      redirecting: '跳转中。。。',
      commentTab: '留言板',
      chatTab: '在线聊天',
      inboxTab: '私信',
      profileTab: '个人资料',
      close: '关闭',
      cancel: '取消',
      submit: '提交!',
      submitting: '提交中。。。',
      submitted: '提交成功!',
      submitCommentFailed: '提交失败',
      connect: '连线！',
      connecting: '连线中。。。',
      connected: '已连接！',
      disconnect: '断开连接',
      disconnected: '已断开连接！',
      online: '在线',
      offline: '离线',
      loading: '载入中。。。',
      invite: '邀请',
      everybody: '全网用户',
      sameSitePeople: '全站用户',
      invitations: '邀请',
      onlineUsers: '在当前页面的用户',
      sameSiteChatTitle: '和当前网站的用户在线聊天',
      noInvitation: '没有收到任何邀请',
      toggleSamePageChat: '选择同页面或者同站点聊天',
      toggleSamePageChatING: '切换中。。。',
      samePageChat: '网页',
      sameSiteChat: '网站',
      typeHere: '输入。。。',
      joinMe: '邀请大家去',
      liveChatWelcomeLog: '和当前页面的用户在线聊天',
      liveChatWelcomeLogSameSite: '和当前网站的用户在线聊天',
      comment: '留言！',
      commentsTotal: '{num} 条留言',
      startConversation: '开始私聊吧！',
      conversationWith: '和',
      conversationWithAfter: '的对话',
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
      sendingInvitation: '邀请发送中。。。',
      invitationSent: '邀请发送成功',
      numUserReceived: '位关注者收到',
      welcomeInstall: '欢迎使用这款插件!',
      registerFailed: '注册失败，请刷新重试',
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
  el: '#image-modal',
  render: h => h(imageModal)
})

new Vue({
  el: '#chatbox',
  i18n,
  render: h => h(chatboxMainVue)
})
