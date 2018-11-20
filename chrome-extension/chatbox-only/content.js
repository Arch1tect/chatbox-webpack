(function() {
var CHATBOX_ELEMENT_ID = 'chatbox-iframe';
var CHATBOX_FRAME_SRC = 'chatbox-only/chatbox-frame.html';
var chatboxIFrame;
var chatboxLeft = 0;
var locationHref = location.href;
var created = false;
var localChatboxExists = false;

var runningExtension = false;
if (typeof(chrome) !== 'undefined' && chrome.extension)
    runningExtension = true;

function createChatboxIframe() {
    // check if there is already chatbox created
    if (document.getElementById(CHATBOX_ELEMENT_ID)) {
        if (runningExtension) {
            localChatboxExists = true;
            console.log('chatbox local exists');
        } else {
            console.log('chatbox extension exists');
        }
        return
    }
    console.log('creating chatbox iframe');
    chatboxIFrame  = document.createElement ("iframe");
    window.chatboxIFrame = chatboxIFrame;
    if (runningExtension)
        chatboxIFrame.src = chrome.extension.getURL(CHATBOX_FRAME_SRC);
    else
        chatboxIFrame.src = CHATBOX_FRAME_SRC;
    chatboxIFrame.src +=  "?"+locationHref;
    chatboxIFrame.id = CHATBOX_ELEMENT_ID;
    document.body.insertBefore(chatboxIFrame, document.body.firstChild);
    created = true
    keepCheckingLocationChange();
}
function keepCheckingLocationChange() {
    checkLocationChange();
    window.chatboxIFrame.contentWindow.postMessage({'title': document.title}, "*")
    setTimeout(function(){keepCheckingLocationChange()}, 3*1000);
}
function checkLocationChange() {
    var newLocation = location.href;
    if (window.chatboxLocation) newLocation = window.chatboxLocation;
    if (newLocation !== locationHref) {
        locationHref = newLocation;
        chatboxIFrame.parentNode.removeChild(chatboxIFrame);
        createChatboxIframe();
    }
}
window.checkLocationChange = checkLocationChange;

function resizeIFrameToFitContent(e) {
    if (!created) return;
    if (!e || !e.data )
        return;
    var msg = e.data;

    if (!msg.state)
        return;
        
    if (msg.state ==='show') {
        chatboxIFrame.style.display  = "block";
        console.log('show iframe');

    }
    else if (msg.state ==='full size') {
        chatboxIFrame.style.display  = "block";
        chatboxIFrame.style.width  = "100%";
        chatboxIFrame.style.height = "100%";
        console.log('resize iframe to 100%');
    }
    else if (msg.state === 'minimize') {
        fitChatboxIframe(msg);
    }
    else if (msg.state === 'close') {   //only hide but still running
        chatboxIFrame.style.display  = "none";
        console.log('hide iframe');
    }
    else if (msg.state === 'move start') {
        chatboxLeft = chatboxIFrame.style.left.replace('px','');
        if (!chatboxLeft)
            chatboxLeft = 0;
        else
            chatboxLeft = parseInt(chatboxLeft);
    }
    else if (msg.state === 'moving') {
        chatboxIFrame.style.left = chatboxLeft + msg.dx + 'px';
    }
    else if (msg.state === 'fit') { // fit - make page same size as chatbox
        fitChatboxIframe(msg);
    }
}

function fitChatboxIframe (msg) {
    if (!created) return;
    chatboxIFrame.style.display  = "block";
    chatboxIFrame.style.width  = msg.width;
    chatboxIFrame.style.height = msg.height;
}

// NOTE: window.addEventListener("message" ...) only receive msg from tab,
// can't receive msg from extension directly, to receive msg from extension,
// use chrome.runtime.onMessage.addListener
window.addEventListener("message", resizeIFrameToFitContent, false);
window.addEventListener("message", function(e){
    if (e && e.data && e.data.chatboxRedirect) {
        location.replace(e.data.chatboxRedirect);
    }
}, false);

// always create the chatbox and make connections, if user don't want it, he can disable the extension
// createChatboxIframe();
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (!request.chatboxMsg)
        return;
    var msg = request.chatboxMsg;
    if (msg == "open_chatbox") {
        createChatboxIframe();
        sendResponse({msg: "shown"});
    }
});



chrome.storage.local.get('chatbox_config', function(item){
    var configData = item['chatbox_config'] || {};
    var shouldCreateIframe = false;
    if (configData['tmp_allow']) {
        var allowUrlList = configData['tmp_allow'] || [];
        if (locationHref in allowUrlList) {
            shouldCreateIframe = true;
        }
    }
    if (configData['display'] && configData['display'] !== 'hidden') {
        shouldCreateIframe = true;
    }

    if (shouldCreateIframe) {
        createChatboxIframe();
    }
});
            // chatboxUtils.storage.get('danmu', function (item) {
            //     var display = item['danmu'];
            //     // Default danmu css is display: none
            //     if (!display) {
            //         if (chatboxConfig.danmu) {
            //             display = 'block';
            //         } else {
            //             display = 'none';
            //         }
            //     }
            //     chatboxUtils.toggleDanmu(display);
            // });
})();