var CHATBOX_ELEMENT_ID = 'chatbox-iframe';
var CHATBOX_FRAME_SRC = 'chatbox-only/chatbox-frame.html';
var chatboxIFrame;
var locationHref = location.href;
var iframeCreated = false;
var localChatboxExists = false;
// var chatboxLeft = 0;

var runningExtension = false;
if (typeof(chrome) !== 'undefined' && chrome.extension) {
    runningExtension = true;
}

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
    iframeCreated = true
    keepCheckingLocationChange();
}
function keepCheckingLocationChange() {
    checkLocationChange();
    var msg = {
        'locationUpdate': true,
        'title': document.title,
        'url': location.href
    }
    window.chatboxIFrame.contentWindow.postMessage(msg, "*");
    setTimeout(function(){keepCheckingLocationChange()}, 3*1000);
}
function checkLocationChange() {
    return;
    // Do not recreate whole iframe, just notify iframe that url has changed
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
    if (!iframeCreated) return;
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
        chatboxIFrame.style.width  = "100%"; //dragging may show shadow if drag too left
        chatboxIFrame.style.height = "100%";
        console.log('resize iframe to 100%');
    }
    else if (msg.state ==='show modal') {
        chatboxIFrame.style.display  = "block";
        chatboxIFrame.style.width  = "100%"; //dragging may show shadow if drag too left
        chatboxIFrame.style.height = "100%";
        chatboxIFrame.style.left = "0px";
        console.log('resize iframe to 100% and center');
    }
    else if (msg.state === 'minimize') {
        fitChatboxIframe(msg);
    }
    else if (msg.state === 'close') {   //only hide but still running
        chatboxIFrame.style.display  = "none";
        console.log('hide iframe');
    }
    else if (msg.state === 'moving') {
        moveFrame(msg.left);
    }
    else if (msg.state === 'fit') { // fit - make page same size as chatbox
        fitChatboxIframe(msg);
    }
}
function moveFrame (left) {
    var chatboxLeft = left;
    if (chatboxLeft < 0) chatboxLeft = 0;
    var maxLeft = window.innerWidth - 200;
    if (chatboxLeft > maxLeft) chatboxLeft = maxLeft;
    chatboxIFrame.style.left = chatboxLeft + 'px';
}

function fitChatboxIframe (msg) {
    if (!iframeCreated) return;
    chatboxIFrame.style.display  = "block";
    chatboxIFrame.style.width  = msg.width;
    chatboxIFrame.style.height = msg.height;
    chatboxIFrame.style.left = msg.left + 'px';
    moveFrame(msg.left);
}

// NOTE: window.addEventListener("message" ...) only receive msg from tab,
// can't receive msg from extension directly, to receive msg from extension,
// use chrome.runtime.onMessage.addListener
window.addEventListener("message", resizeIFrameToFitContent, false);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (!request.chatboxMsg)
        return;
    var msg = request.chatboxMsg;
    if (msg == "open_chatbox") {
        if (!document.getElementById(CHATBOX_ELEMENT_ID)) {
            // If user clicks on open chatbox and chat box not created
            // full size and connect chat like redirected case
            // Maybe shouldn't connect live chat in such case,
            // using the redirect since there's no flag to tell chatbox to show
            // full size temporarily
            chrome.storage.local.get('chatbox_config', function(item){
                var configData = item['chatbox_config'] || {};
                var redirectDict = {};
                redirectDict[locationHref] = true;
                configData['redirect'] = redirectDict;
                chrome.storage.local.set({'chatbox_config': configData});
            });
            createChatboxIframe();
        }
        sendResponse({msg: "shown"});
    }
});
// TODO: if show danmu selected, create iframe so we can pull
// invitations?
// Separate invitation danmu and chat danmu?
chrome.storage.local.get('chatbox_config', function(item){
    var configData = item['chatbox_config'] || {};
    var shouldCreateIframe = false;
    if ('livechat_anywhere' in configData) {
        shouldCreateIframe = configData['livechat_anywhere'];
    } else {
        // If not set, join live chat by default
        shouldCreateIframe = true;
    }
    if (configData['redirect']) {
        var allowUrlList = configData['redirect'] || [];
        if (locationHref in allowUrlList) {
            shouldCreateIframe = true;
        }
    }
    if (configData['display'] && configData['display'] !== 'hidden') {
        shouldCreateIframe = true;
    }
    // Below is commented out because invitations are only loaded
    // via socket now, allowing invitation in damu doesn't affect whether we
    // create chatbox iframe or not
    // if ('invitation_danmu' in configData) {
    //     if (configData['invitation_danmu']!='never') {
    //         shouldCreateIframe = true;
    //     }
    // } else {
    //     shouldCreateIframe = true;
    // }

    if (shouldCreateIframe) createChatboxIframe();

    if (!shouldCreateIframe) {
        chrome.storage.local.get('whitelist', function(item){
            var whitelist = item['whitelist'];
            var url = extractRootDomain(locationHref);
            if (whitelist && url in whitelist) {
                createChatboxIframe();
            }
        });
    }
});

function extractRootDomain(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;
    //extracting the root domain here
    //if there is a subdomain 
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
        if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            //this is using a ccTLD
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
}

function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname
    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }
    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];
    return hostname;
}


// tab visibility change handling code below
var tabHidden = "hidden";
function handleTabVisibilityChange() {
    // only need to handle it if iframe isn't created
    if (document.getElementById(CHATBOX_ELEMENT_ID)) return;

    if (document[tabHidden]) {
        // going to hide
    } else {
        chrome.runtime.sendMessage({ "clearIcon" : true });
    }
}
// Set the name of the hidden property and the change event for visibility
var visibilityChange; 
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
  tabHidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  tabHidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  tabHidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}
if (!document[tabHidden]) {
    // when page just load, iframe isn't created yet, we should clear icon
    // IF page is visible, it's possible user open a tab but it's not visible
    chrome.runtime.sendMessage({ "clearIcon" : true });
}
// Warn if the browser doesn't support addEventListener or the Page Visibility API
if (typeof document.addEventListener === "undefined" || tabHidden === undefined) {
  console.log("browser needs to support the Page Visibility API.");
} else {
  // Handle page visibility change   
  document.addEventListener(visibilityChange, handleTabVisibilityChange, false);
}
