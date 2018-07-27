<template>
    <div id="chatbox-main-vue">

        <div id="socketchatbox-all" class="socketchatbox-page">
            <div id="socketchatbox-ne" class="socketchatbox-resize"></div>
            <top-bar></top-bar>
            <div id='socketchatbox-body'>
                <div class='socketchatbox-onlineusers'></div>
                <div class = "socketchatbox-typing"> </div>
                <comment-body></comment-body>
                <chat-body></chat-body>
                <inbox-body></inbox-body>
                <input-bar></input-bar>
                <comment-btn></comment-btn>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'chatbox-main-vue',
    data () {
        return {
            msg: 'Welcome to Your Vue.js App'
        }
    }
}
</script>
