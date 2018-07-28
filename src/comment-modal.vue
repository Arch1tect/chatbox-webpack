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
<style>
.modal.show .modal-dialog {
    -webkit-transform: translate(0,0);
    transform: translate(0,0);
}
.modal.fade .modal-dialog {
    transition: -webkit-transform .3s ease-out;
    transition: transform .3s ease-out;
    transition: transform .3s ease-out,-webkit-transform .3s ease-out;
    -webkit-transform: translate(0,-25%);
    transform: translate(0,-25%);
}
.modal-dialog {
    max-width: 500px;
    margin: 1.75rem auto;
}
.modal-dialog {
    position: relative;
    width: auto;
    margin: .5rem;
    pointer-events: none;
}
.modal-content {
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    width: 100%;
    pointer-events: auto;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0,0,0,.2);
    border-radius: .3rem;
    outline: 0;
}
.modal-open .modal {
    overflow-x: hidden;
    overflow-y: auto;
}
.fade.in {
    opacity: 1;
}
.fade.show {
    opacity: 1;
}
.modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1050;
    display: none;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    outline: 0;
}
.fade {
    opacity: 0;
    -webkit-transition: opacity .15s linear;
    -o-transition: opacity .15s linear;
    transition: opacity .15s linear;
}
/**, ::after, ::before {
    box-sizing: border-box;
}*/
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
