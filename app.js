
function getGitHubEmojis() {
    var jsonDL = $.getJSON("https://api.github.com/emojis",
        function (data, textStatus, jqXHR) {
            $('h2').empty().append("json downloaded: ", this.url)
            var content = $('.mainContent').empty();

            for (var propName in data) {
                if (data.hasOwnProperty(propName)) {
                    var propValue = data[propName],
                        element = $('.tempImg').clone().removeClass().attr('src', propValue);
                    content.append(element);
                }
            }

        }
    ).fail(function () {
        $('h2').empty().append("getJSON failed").css('background', 'red')
    });
}
