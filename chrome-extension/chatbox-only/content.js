if (location.href.indexOf('dnvod') > -1) {
	var duonaoScript = document.createElement('script');
	duonaoScript.src = chrome.runtime.getURL('duonao.js');
	duonaoScript.onload = function() {
	    duonaoScript.remove();
	};
	document.body.appendChild(duonaoScript);
}