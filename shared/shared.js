var ua = navigator.userAgent.toLowerCase(),
    isIOS = (ua.match(/i(phone|pod|pad)/)!=null),
    isAndrd = (ua.match(/android/)!= null),
    isMac = (ua.match(/macintosh/) != null),
    appName = window.location.pathname.split("/").pop().replace('.html', '')
    ;
    
console.log("userAgent: ", ua);
console.log("isIOS: ", isIOS, " isAndrd: ", isAndrd, " isMac: ", isMac);

    
$(document).ready(function () {    
    // add doc title, h1
    document.title = appName;
    $('h1').html(appName);

    // addClass to html for Css differentiation.
    $('html').addClass(appName);

    // remove clearout btn since iOS app has auto masking content.
    if (isIOS) $('.clearout').remove();
});

// ----- basic navigator func.

function loadNextPage() {
	if ($('#vLinks .selectedBG').length > 0) $('#vLinks .selectedBG:first+.paging').click();
	else $('#vLinks .paging:first').click();
}

function paginPreSet() {
	if ($('#vLinks .paging:first').text() > 1) {
		$('#vLinks .paging').each(function () {
			$(this).removeClass('selectedBG');
			this.textContent = parseInt(this.textContent) - 10;
		});
	}
}

function paginNextSet() {
	$('#vLinks .paging').each(function () {
		$(this).removeClass('selectedBG');
		this.textContent = parseInt(this.textContent) + 10;
	});
}

function resetPaging() {
	$('#vLinks .paging').empty().removeClass('selectedBG').each(function (i, elm) {
		$(elm).html(i);
	});
}

//  ------- vids func.

function enterFullScreenVideo(dom) {
	if (isIOS) dom.webkitEnterFullscreen();
	else if (isAndrd) dom.mozRequestFullScreen();
}

/// for iOS use only.
function exitFullScreenVideo() {
	var vids = $("video#vidPlayer").get();
	if (vids.length) {
		vids[0].pause().webkitExitFullScreen();
	}
}
