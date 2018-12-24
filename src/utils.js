const DEFAULT_CHATBOX_WIDTH = 360;
const DEFAULT_CHATBOX_HEIGHT = 415;

var runningExtension = false;
if (typeof(chrome) !== 'undefined' && chrome.extension)
    runningExtension = true;

import chatboxConfig from './config.js'
import uiState from './ui-state.js'

var storage = {
    get: function (key, callback) {
        if (runningExtension) {
            chrome.storage.local.get(key, callback);
        } else {
            var res = {};
            res[key] = localStorage.getItem(key);
            callback(res);
        }
    },
    set: function (key, value) {
        if (runningExtension) {
            var item = {};
            item[key] = value;
            chrome.storage.local.set(item);
        } else {
            localStorage.setItem(key, value);
        }
        
    }
}
var tabVisibleCallbacks = [];
var tabInvisibleCallbacks = [];
var imageCache = {};
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
export default {
    runningExtension: runningExtension,
    isPureEmoji: function (content) {
        return content.replace(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g, '') == '';
    },
    addClassToEmoji: function (content) {
        var replaceWith = "<span class='inline-emoji'>$&</span>";
        return content.replace(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g, replaceWith);
    },
    deepCopy: function (data) {
    	return JSON.parse(JSON.stringify(data));
    },
    registerTabVisibleCallbacks: function (func) {
        tabVisibleCallbacks.push(func);
    },
    registerTabInvisibleCallbacks: function (func) {
        tabInvisibleCallbacks.push(func);
    },
    runTabVisibleCallbacks: function () {
        tabVisibleCallbacks.forEach(function (func) {
            func();
        });
    },
    runTabInvisibleCallbacks: function () {
        tabInvisibleCallbacks.forEach(function (func) {
            func();
        })
    },
    updateExtensionBadge: function () {
        console.log('updateExtensionBadge not registered yet');
    },
    updateIframeSize: function (state) {
        // send chat box size to content.js
        // read size from DOM
        var resizeMsg = {};
        resizeMsg.state = state;
        resizeMsg.width  = document.getElementById('socketchatbox-all').offsetWidth + 8 + "px";
        resizeMsg.height = document.getElementById('socketchatbox-all').offsetHeight + "px";
        resizeMsg.left = uiState.left;
        if (state == 'show modal') {
            uiState.shwModal = true;
        } else {
            uiState.shwModal = false;
        }
        if (resizeMsg.height == '0px') {
            console.log('Cannot detect size, using default size');
            resizeMsg.width  = DEFAULT_CHATBOX_WIDTH+'px';
            resizeMsg.height = DEFAULT_CHATBOX_HEIGHT+'px';
        }
        window.parent.postMessage(resizeMsg, "*");
    },
    queueDanmu: function (msg, type) {
        // send chat box size to content.js
        var danmuMsg = {};
        msg.type = type;
        danmuMsg.msg = msg;
        window.parent.postMessage(danmuMsg, "*");
    },
    storage: storage,
    setBasicConfig: function (dict) {
        // this is a short cut for specifically chatbox_config key
        storage.get('chatbox_config', function (item) {
            var configData = item['chatbox_config'] || {};
            for (var key in dict) {
                configData[key] = dict[key];
            }
            storage.set('chatbox_config', configData);
        });
    },
    getBasicConfig: function (callback) {
        storage.get('chatbox_config', function (item) {
            var configData = item['chatbox_config'] || {};
            callback(configData);
        })
    },
    tryLoadingProfileImg: function (obj, userId, useS3) {

        var domain = chatboxConfig.cdnUrl;
        if (useS3) {
            domain = chatboxConfig.s3Url;
        }
        var src = domain+userId+'.jpg';
        if (src in imageCache) {
            obj.profileImgSrc = imageCache[src];
            return;
        }
        obj.profileImgSrc = 'profile-empty.png';
        $("<img/>").on('load', function() {
            obj.profileImgSrc = src;
            imageCache[src] = src;
         }).on('error', function() {
            // no profile image
            // TODO: is this a problem? Wouldn't retry until page refresh
            imageCache[src] = 'profile-empty.png';
        }).attr("src", src);
    },
    genGuid: function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    },
    extractRootDomain: function(url) {
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
}
