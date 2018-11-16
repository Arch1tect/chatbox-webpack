import Vue from 'vue'
import Notifications from 'vue-notification'
Vue.use(Notifications)
import VModal from 'vue-js-modal'
Vue.use(VModal, { componentName: "vue-modal" })

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


new Vue({
  el: '#comment-modal',
  render: h => h(commentModal)
})

new Vue({
  el: '#chatbox',
  render: h => h(chatboxMainVue)
})
