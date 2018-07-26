import Vue from 'vue'
import app from './App.vue'
import topBar from './top-bar.vue'
import chat from './chat.vue'
import inputBar from './input-bar.vue'

Vue.component('top-bar', topBar);
Vue.component('chat-body', chat);
Vue.component('input-bar', inputBar);

new Vue({
  el: '#app',
  render: h => h(app)
})
