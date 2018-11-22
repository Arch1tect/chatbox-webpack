var whitelist = {};
var pageURL = null;
var configDataFromStorage = {};
var chatboxOpenState = false;
// visible strings
var openBoxStr= 'Open';
var closeBoxStr = 'Close';
var defaultDisplayModeStr = 'Default display mode';
var fullStr = 'Full';
var miniStr = 'Mini';
var hiddenStr = 'Hidden';
var danmuStr = 'Show scrolling text for live message?';
var yesStr = 'Yes';
var noStr = 'No';
var autoJoinStr = 'Always join live chat on this website?';
var autoJoinListStr = 'Always join live chat on following sites';
var emptyListStr = 'Not enabled on any website.';

var lng = window.navigator.userLanguage || window.navigator.language;
if (lng.indexOf('zh')>-1) {
    openBoxStr = '打开';
    closeBoxStr = '关闭';
    defaultDisplayModeStr = '默认显示模式';
    fullStr = '正常显示';
    miniStr ='最小化';
    hiddenStr = '不显示';
    danmuStr = '显示弹幕？';
    yesStr = '是';
    noStr = '否';
    autoJoinStr = '浏览当前网站时自动连线？';
    autoJoinListStr = '浏览以下网站时自动连线';
    emptyListStr = '浏览任何网站时都不会自动连线。';
}
function renderWhitelist() {

    // if (pageURL in whitelist) {
    //     $('#open-chatbox').show();
    // } else {
    //     $('#open-chatbox').hide();
    // }

    $('.whitelist').empty();
    var counter = 0;
    for (var url in whitelist) {
        counter++;
        var $urlEntry = $('<div class="whitelist-url"></div>');
        var $removeBtn = $('<span class="remove-url">X</span>');
        if (url == pageURL) $urlEntry.addClass('current');
        $removeBtn.data('url',url);
        $urlEntry.text(url);
        $urlEntry.append($removeBtn);

        $removeBtn.click(function() {
            var _url = $(this).data('url');
            delete whitelist[_url];
            chrome.storage.local.set({ 'whitelist': whitelist }, getWhitelist);
            renderWhitelist();

        })
        $('.whitelist').append($urlEntry);
    }
    if (!counter) {
        var $emptyListP = $('<p></p>');
        $emptyListP.text(emptyListStr);
        $('.whitelist').append($emptyListP);
    }
}

function getWhitelist() {
    chrome.storage.local.get('whitelist', function(data) {
        console.log('Get whitelist from storage.local');
        whitelist = data['whitelist'] || whitelist;
        var enabled = 'no';
        if (pageURL in whitelist) {
            enabled = 'yes';
        }
        var checkbox = "input[name=toggle_whitelist][value="+enabled+"]";
        $(checkbox).prop("checked", true);
        renderWhitelist();
    });
}

function msgChatboxFrame(msg, callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
        // since only one tab should be active and in the current window at once
        // the return variable should only have one entry
        var activeTab = arrayOfTabs[0];
        var activeTabId = activeTab.id;
        // This message is listened by chatbox, but not content.js. 
        // then chatbox pass msg to content.js to resize iframe
        chrome.tabs.sendMessage(activeTabId, {chatboxMsg: msg}, callback);

        if (pageURL) return;

        pageURL = extractRootDomain(activeTab.url);
        getWhitelist();

    });
}

function showHideChatbox() {
    var msg = 'open_chatbox';
    if (chatboxOpenState) {
        msg = 'close_chatbox';
    }
    msgChatboxFrame(msg, function(resp){
        if (resp && resp.msg == "shown") { 
            $('.open-chatbox').text(closeBoxStr);
            chatboxOpenState = true;
        }
        if (resp && resp.msg == "closed") { 
            $('.open-chatbox').text(openBoxStr);
            chatboxOpenState = false;
        }

    });
}
function showHideDanmu(display) {
    var msg = {
        'name': 'toggle-danmu',
        'value': display
    }
    msgChatboxFrame(msg);
}

function checkChatboxStatus() {
    // console.log('Check if chatbox open and get online user count');
    // Ask chatbox whether it's open or not
    // And how many users online at current page
    msgChatboxFrame('is_chatbox_open', function(resp){
        setTimeout(function(){
            checkChatboxStatus();
        }, 3000); 
        if (resp) {
            if (resp.is_chatbox_open) { 
                $('.open-chatbox').text(closeBoxStr);
                chatboxOpenState = true;
            }
            else { 
                $('.open-chatbox').text(openBoxStr);
                chatboxOpenState = false;
            }
            if (resp.userCount > 0) {
                $('#user-count').text(resp.userCount);
                $('#online-user-msg').show();
            }
            // do this every 3 sec to pull latest user count
        } else {
            $('#online-user-msg').text('Please try refreshing this page.');
            $('#online-user-msg').show();
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    $('button.open-chatbox').text(openBoxStr);
    $('.display-mode').text(defaultDisplayModeStr);
    $('label .full').text(fullStr);
    $('label .mini').text(miniStr);
    $('label .hidden').text(hiddenStr);
    $('.danmu').text(danmuStr);
    $('label .yes').text(yesStr);
    $('label .no').text(noStr);
    $('.auto-join').text(autoJoinStr);
    $('.auto-join-list').text(autoJoinListStr);


    $('.open-chatbox').click(showHideChatbox);
    $('body').on('click', 'a', function(){
        chrome.tabs.create({url: $(this).attr('href')});
        return false;
    });
    chrome.storage.local.get('chatbox_config', function(data) {
        var configDataFromStorage = data['chatbox_config'] || {};
        if (configDataFromStorage['display']){
            var checkbox = "input[name=open_chatbox_when][value="+configDataFromStorage['display']+"]";
            $(checkbox).prop("checked",true);
        }
    });
    $('input:radio[name="open_chatbox_when"]').change(function() {
        var val = $(this).val();
        chrome.storage.local.get('chatbox_config', function(data) {
            var configDataFromStorage = data['chatbox_config'] || {};
            configDataFromStorage['display'] = val;
            chrome.storage.local.set({'chatbox_config': configDataFromStorage});
        });
    });
    chrome.storage.local.get('danmu', function(data) {
        var checkbox = "input[name=toggle_danmu][value="+data['danmu']+"]";
        $(checkbox).prop("checked", true);
    });
    $('input:radio[name="toggle_danmu"]').change(function() {
        var display = $(this).val();
        console.log('show danmu ' + display);
        showHideDanmu(display);
        chrome.storage.local.set({ 'danmu': display });
    });
    chrome.storage.local.get('share-location', function(data) {
        var checkbox = "input[name=toggle_share_location][value="+data['share-location']+"]";
        $(checkbox).prop("checked", true);
    });
    $('input:radio[name="toggle_share_location"]').change(function() {
        chrome.storage.local.set({ 'share-location': $(this).val() });
    });
    $('input:radio[name="toggle_whitelist"]').change(function() {
        if ($(this).val() == 'yes') {
            console.log('adding to whitelist');
            whitelist[pageURL]=1;
            msgChatboxFrame('connect_chatbox');
        } else {
            console.log('removing from whitelist');
            delete whitelist[pageURL];
            msgChatboxFrame('disconnect_chatbox');
        }
        chrome.storage.local.set({ 'whitelist': whitelist });
        renderWhitelist();
    });
    checkChatboxStatus();

});

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

// To address those who want the "root domain," use this function:
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