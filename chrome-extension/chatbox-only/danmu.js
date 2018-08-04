(function() {
    "use strict";
const ROW_NUM = 12;
var messages = []; // keep list of active danmu
var waitlist = [];
var danmuWrapper = document.createElement("div");
document.body.insertBefore(danmuWrapper, document.body.firstChild);

function createDanmu(msg) {
    messages.push(msg);
    var danmu  = document.createElement("div");
    msg.el = danmu;
    danmu.className = 'danmu';
    if (msg.live)
        danmu.className += ' live';
    danmu.innerHTML = msg.content;
    if (!msg.content)
        danmu.innerHTML = msg.message;
    danmu.style.top = 30 + msg.row*40 + 'px';
    var startX = window.innerWidth + 'px';
    var time = 10;
    if (msg.content)
        time = 20 - msg.content.length/5;
    if (time < 8)
        time = 8;

    var danmuAnimation = danmu.animate([
          // keyframes, at least two
          { transform: 'translateX('+startX+')' }, 
          { transform: 'translateX(-800px)' }
        ],
        {
          // timing options
          duration: time*1000,
          easing: 'ease-in-out'
        }
    );
    danmuAnimation.onfinish = function () {
        var i = messages.indexOf(msg);
        messages.splice(i, 1);
        danmuWrapper.removeChild(danmu);
    };
    danmu.onmouseover = function () {
        danmuAnimation.pause();
    }
    danmu.onmouseout = function () {
        danmuAnimation.play();
    }
    danmuWrapper.appendChild(danmu);
}

function checkDanmu() {
    // If waitlist is not empty, continue checking spot
    // Otherwise it's triggered when there's no item in waitlist
    if (waitlist.length) {
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
        if (msg.el.getBoundingClientRect().left + msg.el.offsetWidth > window.innerWidth)
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
    var danmuMsg = e.data;

    if (!danmuMsg.msg)
        return;
    waitlist.push(danmuMsg.msg);
    checkDanmu();
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
waitlist = testDanmu;

checkDanmu();
})();