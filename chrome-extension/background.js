chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.clearIcon) {
        chrome.browserAction.setBadgeText({text: ''});
    }

});
console.log(1234567)
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
  	console.log(details);
    return {cancel: details.url.indexOf("s1-a4.dnvod.tv") != -1};
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);