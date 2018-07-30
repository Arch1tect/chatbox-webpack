<template>
    <vue-modal @closed="modalClosed" @opened="autoFocus" height="auto" name="comment-modal">
        <div>
            <textarea ref="commentInput" v-model="comment" placeholder="Add your comment here..." id="socketchatbox-comment-content"></textarea>
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
import chatbox from './config.js'
import chatboxUtils from './utils.js'

export default {
    name: 'comment-modal',
    data () {
        return {
            comment: '',
        }
    },
    methods: {
        submit: function () {
            var _this = this;
            var payload = {
                'user_id': chatbox.userId,
                'message': this.comment
            }
            $.post(chatbox.commentUrl + "/db/comments/url/"+ chatbox.location, payload, function(resp) {
                console.log(resp);
                _this.$modal.hide('comment-modal');
                _this.comment = '';
                chatbox.loadComments();
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
        chatbox.openCommentModal = function () {
            _this.$modal.show('comment-modal');
            chatboxUtils.updateIframeSize('full size');
        }
    }
}
</script>
