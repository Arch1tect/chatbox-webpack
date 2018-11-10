<template>
    <vue-modal @closed="modalClosed" @opened="autoFocus" height="auto" name="comment-modal">
        <div>
            <textarea ref="commentInput" v-model="comment" :placeholder="placeholder" id="socketchatbox-comment-content"></textarea>
        </div>
        <div class="comment-modal-footer">
            <span @click="$modal.hide('comment-modal')" >Cancel</span>
            <span id="submit-comment-btn" v-on:click="submit">Submit!</span>
        </div>
    </vue-modal>
</template>
<style>
.v--modal-overlay {
    z-index: 2147483647;
}
.v--modal-box {
    padding: 20px;
    background-color: #eceff1;
    font-family:Arial,Helvetica,sans-serif;
    font-size:15px;
    max-width: 100%;
}
.v--modal-box textarea {
    width: 100%;
    font-size:15px;
    height: 200px;
}
.comment-modal-footer {
    float: right;
    margin-top: 15px;
}
.comment-modal-footer span {
    padding: 8px;
    border-radius: 4px;
    color: white;
    background: gray;
    cursor: pointer;
}
.comment-modal-footer #submit-comment-btn {
    background: #00a1ff;
}

</style>
<script>
import chatboxUIState from './ui-state.js'
import chatboxConfig from './config.js'
import chatboxUtils from './utils.js'

export default {
    name: 'comment-modal',
    data () {
        return {
            comment: '',
            replyToId: null,
            replyToName: null,
            placeholder: 'Add your comment here...'
        }
    },
    methods: {
        submit: function () {
            // TODO: disable button and show loading when waiting for ajax to finish
            if (this.comment === '') {
                this.$modal.hide('comment-modal');
                return;
            }
            var _this = this;
            var payload = {
                'user_id': chatboxConfig.userId,
                'user_name': chatboxConfig.username,
                'message': this.comment,
                'reply_to_user_id': this.replyToId,
                'reply_to_user_name': this.replyToName
            }
            $.post(chatboxConfig.apiUrl + "/db/comments/v2/url/"+ chatboxConfig.location, payload, function(resp) {
                _this.$modal.hide('comment-modal');
                _this.comment = '';
                chatboxUtils.loadComments();
                Vue.notify({
                  title: 'Submitted!',
                });
            }).fail(function(){
                Vue.notify({
                  title: 'Fail to leave comment!',
                  type: 'error'
                });
            });
        },
        autoFocus: function () {
            this.$refs.commentInput.focus();
        },
        modalClosed: function () {
            chatboxUtils.updateIframeSize('fit');
        }
    },
    created () {
        var _this = this;
        chatboxUtils.openCommentModal = function (userId, name) {
            _this.$modal.show('comment-modal');
            _this.replyToId = null;
            _this.replyToName = null;
            _this.placeholder = 'Add your comment here...';
            if (userId) {
                _this.replyToId = userId;
                _this.replyToName = name;
                _this.placeholder = "Reply to " + name;
            }
            chatboxUtils.updateIframeSize('full size');
        }
    }
}
</script>
