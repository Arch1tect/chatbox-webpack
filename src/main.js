import Vue from 'vue'
import 'bootstrap'
import chatboxMainVue from './main.vue'
import commentModal from './comment-modal.vue'
import topBar from './component/top-bar.vue'
import chat from './component/chat.vue'
import inbox from './component/inbox.vue'
import inputBar from './component/input-bar.vue'
import comment from './component/comment.vue'
import commentBtn from './component/comment-btn.vue'

Vue.component('top-bar', topBar);
Vue.component('chat-body', chat);
Vue.component('inbox-body', inbox);
Vue.component('comment-body', comment);
Vue.component('comment-btn', commentBtn);
Vue.component('input-bar', inputBar);



new Vue({
  el: '#comment-modal',
  render: h => h(commentModal)
})

new Vue({
  el: '#chatbox',
  render: h => h(chatboxMainVue)
})