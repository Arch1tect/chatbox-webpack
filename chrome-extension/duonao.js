console.log('load duonao script');


function classicDuonao () {
	// this has to be ran in duonao context
	console.log('filter ads for classic duonao');
	$("body").trigger("filterAds");
	var pauseHandlerOld = pauseHandler;
	pauseHandler = function () {
		console.log('pppaused');
		pauseHandlerOld();
	}
	var playHandlerOld = playHandler;
	playHandler = function () {
		console.log('rrresumed');
		playHandlerOld();
	}
	var timeHandlerOld = timeHandler;
	timeHandler = function (time) {
		// console.log(time);
		timeHandlerOld();
	}
}

function removeAdSides () {
	//only for www.dnvod.tv ?
	console.log('remove ad sides')
	var videoContainerQuery = document.getElementsByClassName('video-player');
	if (videoContainerQuery.length) {
		var videoContainer = videoContainerQuery[0];
		videoContainer.style.margin='0px';
		var videoSideAds = document.getElementsByClassName('player-side');
		while(videoSideAds.length) {
			videoSideAds[0].remove();
		}
		var videoPauseAds = document.getElementsByTagName('vg-pause-ads');
		while(videoPauseAds.length) {
			videoPauseAds[0].remove();
		}
	}
}

if (location.href.indexOf('classic.dnvod.tv')>-1) {
	classicDuonao();
}
// setTimeout(function(){
// 	removeAdSides();
// }, 3000);

