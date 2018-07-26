<template>
    <div v-on:click.self="state.mini=!state.mini" v-bind:class="{ mini: state.mini }" id='socketchatbox-top'>
        <span data-toggle="tooltip" data-placement="bottom" title='User in this room' id='socketchatbox-online-usercount' class='badge'> 
        </span>
        <div v-show="!state.mini" data-toggle="tooltip" data-placement="bottom" title='Edit your name' id='socketchatbox-username'>{{username}}</div>
        <span v-show="!state.mini" id='topbar-options' class='float-right'>
            <span class="fa fa-pencil" title='Comments' data-toggle="tooltip" data-placement="bottom" id='socketchatbox-comments' v-on:click='state.view=1' v-bind:class="{ selected: state.view==1 }"></span>
            <span class="fa fa-comments" title='Live chat' data-toggle="tooltip" data-placement="bottom" id='socketchatbox-live' v-on:click='state.view=2' v-bind:class="{ selected: state.view==2 }"></span>
            <span class="fa fa-inbox" title='Inbox' data-toggle="tooltip" data-placement="bottom" id='socketchatbox-inbox' v-on:click='state.view=3' v-bind:class="{ selected: state.view==3 }"></span>
            <span class="fa fa-close" title='Close' data-toggle="tooltip" data-placement="bottom" id='socketchatbox-closeChatbox'></span>
        </span>
    </div>
</template>

<script>
import chatboxUIState from './ui-state.js'
export default {
    name: 'top-bar',
    data () {
        return {
            username: 'Hello Vue!',
            state: chatboxUIState
        }
    }
}
</script>
