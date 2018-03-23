var ua = navigator.userAgent.toLowerCase(),
    isIOS = (ua.match(/i(phone|pod|pad)/) != null),
    isIPad = (ua.match(/ipad/) != null),
    isAndrd = (ua.match(/android/) != null),
    isMac = (ua.match(/macintosh/) != null),
    appName = window.location.pathname.split("/").pop().replace('.html', ''),
    imgSection = $('#panes'),
    myJsonBaseUrl = "https://api.myjson.com/bins/",
    menuList;

console.log("userAgent: ", ua);
console.log("isIOS: ", isIOS, "isIPad: ", isIPad, " isAndrd: ", isAndrd, " isMac: ", isMac);


$(document).ready(function () {
    // add doc title, h1
    document.title = appName;
    $('h1').html(appName);

    // addClass to html for Css differentiation.
    $('html').addClass(appName);

    // remove clearout btn since iOS app has auto masking content.
    if (isIOS) {
        $('.clearout').remove();
        $('.androidOnly').remove();
        $('linkHi').removeAttr('target');
    }

    if (!$('.menuBtn').length) {
        $('h1').after('<div class="menuBtn" onclick="toggleMenu();">&#9776;</div>');
        $('.homeBtn').empty().append('&#8962;')
    }
    
    if (isMac) window.onresize = function(event) {
        var marLeft = (window.innerWidth % ($('.itm').width() + 6)) / 2;
        imgSection.css('margin-left', marLeft)
    };
});

function getMenuList() {
    getJsonBins('10vvwl', function (data) {
        menuList = data.Segments;

        if (menuList.length > 0) {
            var ul = $(document.createElement('ul')).addClass('segments').hide();
            $.each(menuList, function (i, seg) {
                ul.append('<li><a href="' + seg + '.html">' + seg)
            })
            ul.insertAfter('h1').slideToggle();
        } else $('#segmentInput').show();

    })
}

function toggleMenu() {
    if (!menuList) getMenuList();
    else $('.segments').slideToggle()
}

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
    if (isIOS) {
        dom.play();
        dom.addEventListener('loadedmetadata', function() {
            dom.webkitEnterFullscreen();
        });
    }
    if (isAndrd) dom.play().mozRequestFullScreen();
}

/// for iOS use only.
function exitFullScreenVideo() {
    var video = $('video.activeVidPlayer').get(0);
    if (video) {
        video.webkitExitFullScreen();
        video.pause();
    }
}

// insert fancy box script, css and .vidLarge button.
function insertFancyBox() {
   $('head>script').after(
       '<script src="https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.2.5/jquery.fancybox.min.js"> <\/script> <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.2.5/jquery.fancybox.min.css">'
   );
   $('.clearout').before('<div class="clearout vidLarge" onclick="$.fancybox.open( $(\'.activeVidPlayer\'))">［  ］<\/div>');
}

// on fancybox close, pause video.
$(document).on('afterClose.fb', function (e, instance, slide) {
    $('.activeVidPlayer').show();
    if ($('video.activeVidPlayer').get(0)) $('.activeVidPlayer').get(0).pause();
});

//  -------------- YQL utilities.

// return a yahoo yql url to parse html of given source url and xpath into json obj.
function createYqlHtmlUrl(whereUrl, xPath, isDiag) {
    (isDiag) ? isDiag = true: isDiag = false;
    return "https://query.yahooapis.com/v1/public/yql?q=select * from htmlstring where url='" +
encodeURIComponent(whereUrl + "' and xpath='" + xPath) +
"'&format=json&env=store://datatables.org/alltableswithkeys&diagnostics=" + isDiag;
}

// return a yahoo yql url to parse json of given source url. 
function createYqlJsonUrl(whereUrl, isDiag) {
    (isDiag) ? isDiag = true: isDiag = false;
    return "https://query.yahooapis.com/v1/public/yql?q=select * from json where url='" + encodeURIComponent(
whereUrl) + "'&format=json&diagnostics=" + isDiag;
}

// return a yahoo yql url to parse xml of given source url. 
function createYqlXmlUrl(whereUrl, isDiag) {
    (isDiag) ? isDiag = true: isDiag = false;
    return "https://query.yahooapis.com/v1/public/yql?q=select * from xml where url='" + encodeURIComponent(
whereUrl) + "'&format=json&diagnostics=" + isDiag;
}

// have yahoo yql parse html into json
function getJsonUsingYqlHtml(fromHtmlUrl, xPath, callback) {
    var yqlUrl = createYqlHtmlUrl(fromHtmlUrl, xPath);
    $.getJSON(yqlUrl, function (data) {
        callback(data.query.results.result);
    })
}

// This allow to get json from source that have CORP restricted.
function getJsonUsingYqlJson(fromJsonUrl, callback) {
    var yqlUrl = createYqlJsonUrl(fromJsonUrl);
    $.getJSON(yqlUrl, function (data) {
        callback(data.query.results.json);
    })
}

// This allow to get json from source that have CORP restricted.
function getJsonUsingYqlXml(fromXmlUrl, callback) {
    var yqlUrl = createYqlXmlUrl(fromXmlUrl);
    $.getJSON(yqlUrl, function (data) {
        callback(data.query.results);
    })
}

//  -------------- myJson utilities.

function getJsonBins(id, callback) { 
    $.getJSON(myJsonBaseUrl + id, function (data) {
        callback(data);
    });
}

// if success callback(true), esle false
function updateJsonBinOfLikes(binId, likeId, callback) {
    getJsonBins(binId, function (existingLikeIds) {
        // if not yet liked, add it, else remove it.
        if (existingLikeIds.indexOf(likeId) < 0) existingLikeIds.push(likeId);
        else existingLikeIds.splice(existingLikeIds.indexOf(likeId), 1);

        $.ajax({
            type: "PUT",
            url: myJsonBaseUrl + binId,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(existingLikeIds),
            success: function (response) {
                callback(true)
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            callback(false);
        });
    });
}
