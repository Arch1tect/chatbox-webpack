<template>
    <vue-modal @closed="modalClosed" height="auto" name="image-modal">
        <div class="enlarged-image-wrapper">
            <img class="enlarged-image" v-bind:src="imgSrc" /> 
        </div>
    </vue-modal>
</template>
<style>
.enlarged-image-wrapper {
    max-height: 500px;
    overflow-y: auto;
}
img.enlarged-image {
    margin: auto;
    display: block;
    max-width: 100%;
}
</style>
<script>
import chatboxConfig from './config.js'
import chatboxUtils from './utils.js'

export default {
    name: 'image-modal',
    data () {
        return {
            imgSrc: '',
        }
    },
    methods: {
        modalClosed: function () {
            chatboxUtils.updateIframeSize('fit');
        }
    },
    created () {
        var _this = this;
        chatboxUtils.openImageModal = function (imgSrc) {
            _this.$modal.show('image-modal');
            _this.imgSrc = imgSrc;
            chatboxUtils.updateIframeSize('show modal');
        }
    }
}
</script>
