<template>
    <div v-show="state.view==4">
        <div class="socketchatbox-page-title">
            <span class="leave-others-profile"><font-awesome-icon icon="long-arrow-alt-left" v-on:click='state.view=0' /></span>

            <span class='site-page-chat-toggle blue' :title="$t('m.toggleSamePageChat')">
                <span @click='showFollowing=true' class='toggle-switch left-switch' :class='{selected: showFollowing}'>{{$t('m.followingCount')}}</span>
                <span @click='showFollowing=false' class='toggle-switch right-switch' :class='{selected: !showFollowing}'>{{$t('m.followerCount')}}</span>
            </span>
        </div>
        <center class="socketchatbox-followersArea">
            <span v-if="showFollowing" class="follower-wrapper" v-for="user in followings" :key="user.user_id" @click="utils.viewOthersProfile(4, user.user_id, user.name)">
                <img v-bind:src="user.profileImgSrc" />
                <div>{{user.name}}</div>
            </span>
            <span v-if="!showFollowing" class="follower-wrapper" v-for="user in followers" @click="utils.viewOthersProfile(4, user.user_id, user.name)">
                <img v-bind:src="user.profileImgSrc" />
                <div>{{user.name}}</div>
            </span>
        </center>
        <div class="follower-footer"></div>
    </div>
</template>
<style>
.site-page-chat-toggle.blue .selected {
    background: rgb(0, 153, 255);
}
.socketchatbox-followersArea {
    width: 100%;
    height: calc(100% - 30px);
    background: #eceff1;
    padding-top: 10px;
    overflow-y: auto;
}
.follower-wrapper {
    display: inline-block;
    text-align: center;
    margin: 5px;
}
.follower-wrapper img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 100%;
    box-shadow: 0 0 6px black;
    margin: 5px;
    cursor: pointer;
    /*margin-bottom: 5px;*/
}
.follower-footer {
    width: 100%;
    height: 35px;
    border: none;
    border-top: 1px solid #d3d3d3;
    float: left;
    border-radius: 0;
    font-weight: 400;
    background: white;
}

</style>
<script>
    import chatboxUIState from '../ui-state.js'
    import chatboxConfig from '../config.js'
    import chatboxUtils from '../utils.js'


    "use strict";

    export default {
        name: 'followers-body',
        data () {
            return {
                state: chatboxUIState,
                chatbox: chatboxConfig,
                utils: chatboxUtils,
                showFollowing: true,
                followers: [],
                followings: [],

            }
        },
        methods: {
            init: function (showFollowing, followings, followers) {
                this.state.view = 4;
                var _this = this;
                _this.showFollowing = showFollowing;

                followers.forEach(function (user) {
                    chatboxUtils.tryLoadingProfileImg(user, user.user_id, false);
                });
                followings.forEach(function (user) {
                    chatboxUtils.tryLoadingProfileImg(user, user.user_id, false);
                });
                setTimeout(function () {

                        _this.followings = followings;
                        _this.followers = followers;

                }, 100)


            },
            changeFollowing: function (follow, userId, name) {
                // Used by others-profile.vue
                var user = {
                    user_id: userId,
                    name: name
                };
                if (follow) {
                    chatboxUtils.tryLoadingProfileImg(user, user.user_id, false);
                    this.followings.push(user);
                } else {
                    var index = 0;
                    for(; index < this.followings.length; index ++) {
                        if (this.followings[index].user_id == userId)
                            break;
                    }
                    this.$delete(this.followings, index);
                }

            }
        },
        created () {
            chatboxUtils.viewFollowers = this.init;
            chatboxUtils.changeFollowing = this.changeFollowing;
        }
    }

</script>
