"use strict";

var draggingElement = null;
var invitationStr = ' invites you to ';
var lng = window.navigator.userLanguage || window.navigator.language;
if (lng.indexOf('zh')>-1) {
    invitationStr = ' 邀请大家去 '
}
const ROW_NUM = 12;
var messages = []; // keep list of active danmu
var waitlist = [];
var danmuWrapper = document.createElement("div");
var dragX = 0;
var dragY = 0;
var dragging = false;
danmuWrapper.className = 'danmuWrapper';
var showing = true;
document.body.insertBefore(danmuWrapper, document.body.firstChild);
// function toggleDanmu(display) {
//     danmuWrapper.style.display = display;
//     if (display == 'block') {
//         showing = true;
//         checkDanmu();
//     } else {
//         showing = false;
//     }
// }

document.addEventListener('click',function(e){
    if(e.target && e.target.className== 'invitation-url'){
        var url = e.target.title;
        // don't redirect if already on right page
        if (url == location.href) return;
        chrome.storage.local.get('chatbox_config', function(item) {
            var configData = item['chatbox_config'] || {};
            var data = {};
            data[url] = true;
            configData['redirect'] = data;
            chrome.storage.local.set({'chatbox_config': configData});
            // location.replace(url); // this change browse history and back doesn't work
            window.open(url, '_blank');
        })
    }
 })
function createDanmu(msg) {
    // msg = {
    //     'type': live/comment/invitation,
    //     'content': 'str'
    // }
    messages.push(msg);
    var danmu  = document.createElement("div");
    msg.el = danmu;
    danmu.className = 'danmu';
    var innerHtml = "";
    if (msg.me) {
        danmu.className += ' self';
    }
    var onclickMsg = {
        'openChatbox': true,
    }
    if (msg.type == 'live') {
        danmu.className += ' live';
        var content = msg.content;
        if (!msg.content) content = msg.message;
        innerHtml = "<div class='danmu-text'>"+content+"</div>";
        if(content.startsWith('stickers/')) {
            var src = ""
            if (chrome && chrome.extension)
                src = chrome.extension.getURL('chatbox-only/'+content);
            else
                src = 'chatbox-only/'+content;
            innerHtml = "<img draggable='false' src='"+src+"' />";
        }
        onclickMsg.type = 'chat';
    }
    if (msg.type == 'invitation') {
        var content = msg.username+invitationStr+" <span class='invitation-url' title='"+msg.url+"'>"+msg.pageTitle+"</span>";
        innerHtml = "<div class='invitation'>"+content+"</div>";
        onclickMsg.type = 'invitation';
    }
    // Add sender avatar if there is
    if (msg.profileImgSrc && msg.profileImgSrc != 'profile-empty.png') {
        var avatarSpan = "<img class='danmu-avatar' draggable='false' src='" + msg.profileImgSrc+"' />";
        innerHtml = avatarSpan + innerHtml;
    }
    danmu.onclick = function (e) {
        if (!dragging)
            window.chatboxIFrame.contentWindow.postMessage(onclickMsg, "*");
    }
    danmu.innerHTML = innerHtml;
    danmu.style.top = 30 + msg.row*40 + 'px';
    var startX = window.innerWidth + 'px';
    var time = 20;
    // TODO: figure out good algorithm...
    // if (msg.content) time = 20 - msg.content.length/5;
    // if (time < 10) time = 10;

    // If drag then it's possible to move more than screen wide
    // but animation has stopped...
    if (!danmu.animate)
        return; // safari doesn't support this!
    var danmuAnimation = danmu.animate([
          // keyframes, at least two
          { transform: 'translateX('+startX+')' }, 
          { transform: 'translateX(-2000px)' }
        ],
        {
          // timing options
          duration: time*1000,
          // easing: 'ease-in-out'
        }
    );
    danmu.animation = danmuAnimation;
    danmuAnimation.onfinish = function () {
        var i = messages.indexOf(msg);
        messages.splice(i, 1);
        danmuWrapper.removeChild(danmu);
    };
    danmu.onmouseover = function () {
        danmuAnimation.pause();
    }
    danmu.onmousedown = function (e) {
        draggingElement = danmu;
        dragging = false;
        dragX = e.clientX;
        dragY = e.clientY;
    }
    danmu.onmouseout = function () {
        if (draggingElement != danmu)
            danmuAnimation.play();
    }
    danmuWrapper.appendChild(danmu);
}

function checkDanmu() {
    // If waitlist is not empty, continue checking spot
    // Otherwise it's triggered when there's no item in waitlist
    if (waitlist.length && showing) {
        var spot = findSpot();
        if (spot) {
            var msg = waitlist.shift();
            msg.row = spot;
            createDanmu(msg);
            // Only create one danmu at a time because
            // creating multiple at the same time makes
            // animation laggy
            setTimeout(function(){
                checkDanmu();
            }, 2*1000);
        } else {
            // If no available spot, wait and check again later
            setTimeout(function(){
                checkDanmu();
            }, 3*1000);
        }
    }
}
function findSpot() {
    // Loop through active messages to find
    // occupied rows then find the first available
    // row, if not found, return false
    var freeSpot = null;
    var occupied = {};
    var i = 0;
    for (; i < messages.length; i++) {
        var msg = messages[i];
        if (msg.el.getBoundingClientRect().left + msg.el.offsetWidth > window.innerWidth || !showing)
            occupied[msg.row] = true;
    }
    var j = 1;
    for (; j < ROW_NUM; j ++) {
        if (!(j in occupied)) {
            return j;
        }
    }
    return false;
}
function receiveMsgFromChatboxFrame (e) {

    if (!e || !e.data )
        return;
    e.stopPropagation(); // multiple danmu.js maybe
    var danmuMsg = e.data;
    if (danmuMsg.msg) {
        waitlist.push(danmuMsg.msg);
        checkDanmu();
    }
    // This is deprecated, but there's no way to suddenly
    // hide danmu anywhere...
    // if (danmuMsg.display) {
    //     toggleDanmu(danmuMsg.display);
    // }
}
window.onmouseup = function (e) {
    if (draggingElement) {
        if (draggingElement.animation) {
            draggingElement.animation.play();
        } else {
            // this is user count bubble
            chrome.storage.local.set({'count_bubble_position': {
                    top: draggingElement.style.top,
                    left: draggingElement.style.left
                }
            });
        }
        draggingElement = null;
        e.preventDefault();
        e.stopPropagation();
    }
}
window.onmousemove = function (e) {
    if (!draggingElement) return;
    var dx = e.clientX - dragX;
    var dy = e.clientY - dragY;
    if (dx > 2 || dx < -2|| dragging) {
        dragging = true;
        dragX = e.clientX;
        dragY = e.clientY;
        draggingElement.style.top = draggingElement.offsetTop + dy + 'px';
        draggingElement.style.left = draggingElement.offsetLeft + dx + 'px';
        e.stopPropagation();
        e.preventDefault();
    }
}
window.addEventListener("message", receiveMsgFromChatboxFrame, false);
// test cases below
var testDanmu = [
    {
        content: 'Hello!',
    },
    {
        content: 'Many thanks to Robin Rendle, Chris Coyier, Blake Newman, and Evan You.',
    }

]
// waitlist = testDanmu;
checkDanmu();
