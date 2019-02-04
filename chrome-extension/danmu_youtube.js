"use strict";

// const youtubeAPIUrl = 'http://localhost:9000/db/comments/youtube/';
const youtubeAPIUrl = 'https://api.yiyechat.com/db/comments/youtube/';
var lastCheckedSec = -1;
var youtubeCommentsDict = {};
var videoId = null;
var videoProgressCallbackRegistered = false;
var videoPaused = false;
var showVideoDanmu = true;

const FETCH_NEXT_PAGE_COMMENT_TIMEOUT = 10*1000; // 1min
var fetchNextPageTimeout = null;
var nextPageToken = null;
var pageCount = 0;

function getYoutubeComment () {
	// If there's next page, fetch next page after 1 min
	// at most fetch 10 pages
	console.log('get comment for ' + videoId + ', page num: ' + pageCount);
	$.get(youtubeAPIUrl+videoId, {pageNum: pageCount, pageToken: nextPageToken}).done(function(resp) {
		nextPageToken = resp.nextPageToken;
		pageCount ++;
		for (var sec in resp.comments) {
			if (sec in youtubeCommentsDict) {
				youtubeCommentsDict[sec] = youtubeCommentsDict[sec].concat(resp.comments[sec]);
			} else {
				youtubeCommentsDict[sec] = resp.comments[sec];
			}
		}

		if (nextPageToken) {
			fetchNextPageTimeout = setTimeout(function () {
				getYoutubeComment();
			}, FETCH_NEXT_PAGE_COMMENT_TIMEOUT)
		}

	}).fail(function (xhr, status, error) {}).always(function(){});
}

function _getVideoId () {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get('v');
}

function registerVideoEvents () {
	// register callback on the video player
	if (!document.querySelector('video'))
		return;
	videoProgressCallbackRegistered = true;
	document.querySelector('video').addEventListener('timeupdate', function (e) {
		var sec = Math.floor(e.target.currentTime);
		if (sec == lastCheckedSec)
			return; // avoid same sec trigger multiple times
		lastCheckedSec = sec;
		if (sec in youtubeCommentsDict) {
			// console.log(sec);
			youtubeCommentsDict[sec].forEach(function(comment) {
				waitlist.push(comment);
			})
			checkDanmu();
		}
	});
	document.querySelector('video').addEventListener('pause', function (e) {
		videoPaused = true;
		messages.forEach(function (msg) {
			var danmu = msg.el;
			if (danmu.syncWithVideo) {
				danmu.animation.pause();
			}
		})
	});
	document.querySelector('video').addEventListener('play', function (e) {
		videoPaused = false;
		messages.forEach(function (msg) {
			var danmu = msg.el;
			if (danmu.syncWithVideo) {
				if (!danmu.clickedToPause)
					danmu.animation.play();
			}
		})
	});
}

function initVideoComment () {
	// called when video page first load
	// or when video changed to a different one
	resetParams();
	videoId = _getVideoId();
	if (videoId) {
		if (!videoProgressCallbackRegistered) registerVideoEvents();
		getYoutubeComment();
	}
}

function clearVideoDanmu () {
	try {
		// remove video danmu on screen
		messages.forEach(function (msg) {
			if (msg.type == 'video') {
				var i = messages.indexOf(msg);
				messages.splice(i, 1);
				danmuWrapper.removeChild(msg.el);
			}
		})
	} catch (err) {
		console.log(err);
	}
	// messages = messages.filter(function (msg, index, array) {
	// 	return (msg.type != 'video');
	// }); // can't use filter, has to splice, buggy
}

function resetParams () {
	youtubeCommentsDict = {};
	nextPageToken = null;
	pageCount = 0;
	if (fetchNextPageTimeout) clearTimeout(fetchNextPageTimeout);

	clearVideoDanmu();
}

function keepCheckingYoutubeLocationChange() {
	var curVideoId = _getVideoId();
	if (curVideoId != videoId) {
		// TODO: immediately clear previous video danmu
		console.log('page changed');
		initVideoComment();
	}
	setTimeout(function() {keepCheckingYoutubeLocationChange()}, 3*1000);
}
$(document).ready(function () {
	if (extractRootDomain(location.href) == 'youtube.com') {
		// It seems the video element is always created no matter
		// which page user initially open
		console.log('Youtube!');
		chrome.storage.local.get('chatbox_config', function(item){
            var configData = item['chatbox_config'] || {};
            if ('video_danmu' in configData) {
            	showVideoDanmu = configData['video_danmu'];
            }
            videoId = _getVideoId();
            if (showVideoDanmu) {
				initVideoComment();
			}
			keepCheckingYoutubeLocationChange();
        });
        chrome.storage.onChanged.addListener(function(changes, area){
	        if ('chatbox_config' in changes) {
	        	var configData = changes['chatbox_config']['newValue'] || {};
	            if ('video_danmu' in configData) {
	            	if (showVideoDanmu != configData['video_danmu']) {
	            		showVideoDanmu = configData['video_danmu'];
	            		if (showVideoDanmu) {
	            			console.log('turn on video danmu');
	            			initVideoComment();
	            		} else {
	            			console.log('turn off video danmu');
	            			resetParams();
	            		}
	            	}
	            }
	        }
	    })



	}
});
