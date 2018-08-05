import Vue from 'vue'
import chatboxMainVue from './main.vue'
import commentModal from './comment-modal.vue'
import topBar from './component/top-bar.vue'
import chat from './component/chat.vue'
import inbox from './component/inbox.vue'
import inputBar from './component/input-bar.vue'
import comment from './component/comment.vue'
import commentBtn from './component/comment-btn.vue'
import profile from './component/profile.vue'

Vue.component('top-bar', topBar);
Vue.component('chat-body', chat);
Vue.component('inbox-body', inbox);
Vue.component('comment-body', comment);
Vue.component('profile-body', profile);
Vue.component('comment-btn', commentBtn);
Vue.component('input-bar', inputBar);

// fontawesome start
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faUserCircle, faSyncAlt, faSmile, faLaughWink, faComments, faPaperclip, faInbox, faEdit, faTimes, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faUser)
library.add(faUserCircle)
library.add(faSyncAlt)
library.add(faComments)
library.add(faEdit)
library.add(faSmile)
library.add(faTimes)
library.add(faPaperclip)
library.add(faLaughWink)
library.add(faWindowClose)
library.add(faInbox)
Vue.component('font-awesome-icon', FontAwesomeIcon)
// fontawesome end

import VModal from 'vue-js-modal'
Vue.use(VModal, { componentName: "vue-modal" })

new Vue({
  el: '#comment-modal',
  render: h => h(commentModal)
})

new Vue({
  el: '#chatbox',
  render: h => h(chatboxMainVue)
})
