(function() {

var CHATBOX_ELEMENT_ID = 'chatbox-iframe';
var CHATBOX_FRAME_SRC = 'chatbox-frame.html';
var chatboxCreated = false;
var chatboxIFrame;
var chatboxLeft = 0;

var runningExtension = false;
if (typeof(chrome) !== 'undefined' && chrome.extension)
    runningExtension = true;

function createChatboxIframe() {
    console.log('creating chatbox iframe');
    if (!chatboxCreated) {
        chatboxIFrame  = document.createElement ("iframe");
        if (runningExtension)
            chatboxIFrame.src = chrome.extension.getURL(CHATBOX_FRAME_SRC);
        else
            chatboxIFrame.src = CHATBOX_FRAME_SRC;
        chatboxIFrame.src +=  "?"+location.href;
        chatboxIFrame.id = CHATBOX_ELEMENT_ID;
        document.body.insertBefore(chatboxIFrame, document.body.firstChild);
        chatboxCreated = true;
    }
}

function resizeIFrameToFitContent(e) {

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
    chatboxIFrame.style.display  = "block";
    chatboxIFrame.style.width  = msg.width;
    chatboxIFrame.style.height = msg.height;
}

// NOTE: window.addEventListener("message" ...) only receive msg from tab,
// can't receive msg from extension directly, to receive msg from extension,
// use chrome.runtime.onMessage.addListener
window.addEventListener("message", resizeIFrameToFitContent, false);

createChatboxIframe(); // always create the chatbox and make connections, if user don't want it, he can disable the extension
})();