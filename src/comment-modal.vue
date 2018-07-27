<template>
    <div class="modal fade" id="socketchatbox-comment-modal" tabindex="-1" role="dialog"  aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <textarea ref="commentInput" v-model="comment" placeholder="Add your comment here..." id="socketchatbox-comment-content"></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                    <button type="button" id="submit-comment-btn" class="btn btn-primary" v-on:click="submit" data-dismiss="modal">Submit!</button>
                </div>
            </div>
        </div>
    </div>
</template>

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
                _this.comment = '';
                chatbox.loadComments();
            });
        }
    },
    mounted () {
        var _this = this;
        $('#socketchatbox-comment-modal').on('shown.bs.modal', function () {
            _this.$refs.commentInput.focus();
        });
    }
}
</script>
