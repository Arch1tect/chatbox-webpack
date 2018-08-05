var config = {};

function showHideChatbox() {
    var msg = 'open_chatbox';
    if ($('#open-chatbox').text().toLowerCase().indexOf("close") >= 0) {
        msg = 'close_chatbox';
    }
    chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {

        // since only one tab should be active and in the current window at once
        // the return variable should only have one entry
        var activeTab = arrayOfTabs[0];
        var activeTabId = activeTab.id; // or do whatever you need

        // This message is listened by chatbox, but not content.js. 
        // then chatbox pass msg to content.js to resize iframe
        chrome.tabs.sendMessage(activeTabId, {chatboxMsg: msg}, function(resp){
            if (resp && resp.msg == "shown") { 
                $('#open-chatbox').text('Close Chatbox');
            }
            if (resp && resp.msg == "closed") { 
                $('#open-chatbox').text('Open Chatbox');
            }

        });

    });
}

function showHideDanmu(display) {
    var msg = {
        'name': 'toggle-danmu',
        'value': display
    }
    chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {

        // since only one tab should be active and in the current window at once
        // the return variable should only have one entry
        var activeTab = arrayOfTabs[0];
        var activeTabId = activeTab.id; // or do whatever you need
        // This message is listened by chatbox, but not content.js. 
        // then chatbox pass msg to content.js to resize iframe
        chrome.tabs.sendMessage(activeTabId, {chatboxMsg: msg}, function(resp){
        });
    });
}

function checkChatboxStatus() {
    console.log('Check if chatbox open and get online user count');
    chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {

        // since only one tab should be active and in the current window at once
        // the return variable should only have one entry
        var activeTab = arrayOfTabs[0];
        var activeTabId = activeTab.id; // or do whatever you need
        
        // TBD: activeTab.url and activeTab.title are available, no need
        // to call .sendMessage if those are only info need from tab

        // Ask chatbox whether it's open or not
        // And how many users online at current page
        chrome.tabs.sendMessage(activeTabId, {chatboxMsg: 'is_chatbox_open'}, function(resp){
            setTimeout(function(){
                checkChatboxStatus();
            }, 2000); 

            if (resp) {
                if (resp.userCount > 0) {
                    console.log('resp.userCount ' + resp.userCount);
                    $('#user-count').text(resp.userCount);
                    if (resp.is_chatbox_open) { 
                        $('#open-chatbox').text('Close Chatbox');
                    }
                    else { 
                        $('#open-chatbox').text('Open Chatbox');
                    }
                    $('#online-user-msg').show();

                }
                // do this every 2 sec to pull latest user count
            } else {
                $('#online-user-msg').text('Please try refreshing this page.');
                $('#online-user-msg').show();
            }
        }); 
    });


}

document.addEventListener('DOMContentLoaded', function () {

    $('#open-chatbox').click(showHideChatbox);

    $('body').on('click', 'a', function(){
        chrome.tabs.create({url: $(this).attr('href')});
        return false;
    });
    chrome.storage.local.get('open_chatbox_when', function(data) {
        var checkbox = "input[name=open_chatbox_when][value="+data['open_chatbox_when']+"]";
        $(checkbox).prop("checked",true);
    });
    $('input:radio[name="open_chatbox_when"]').change(function() {
        var val = $(this).val();
        chrome.storage.local.set({ 'open_chatbox_when': val });
        if (val == 'minimized')
            chrome.storage.local.set({ 'display': 'mini' });
        if (val == 'full_size')
            chrome.storage.local.set({ 'display': 'full' });
        if (val == 'never')
            chrome.storage.local.set({ 'display': 'hidden' });
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

    checkChatboxStatus();

});
