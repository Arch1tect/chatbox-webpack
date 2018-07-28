<template>
    <button v-show="state.view == 1" type="button" data-toggle="modal" data-target="#socketchatbox-comment-modal" class="btn btn-default" id="socketchatbox-comment-btn-wrapper">
        <span class="fa fa-pencil" id='socketchatbox-comment-btn'></span>
        <span>Add your comment!</span>
    </button>
</template>
<style>
#socketchatbox-comment-btn-wrapper {
  width: 100%;
  height: 35px;
  border: none;
  border-top: 1px solid lightgray;
  float: left;
  border-radius: 0;
  background: white;
}
#socketchatbox-comment-btn-wrapper:hover {
  /*background:white;*/
  cursor: pointer;
}
#socketchatbox-comment-btn-wrapper span.fa {
  margin-right: 5px; 
}
</style>
<script>
import * as moment from 'moment';

import chatboxUIState from '../ui-state.js'
import chatbox from '../config.js'

"use strict";

var titleStr = 'Comments on this page';

export default {
    name: 'comment-btn',
    data () {
        return {
            state: chatboxUIState,
            chatbox: chatbox
        }
    }
}

</script>
