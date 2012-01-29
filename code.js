$(function () {
    "use strict";

    $('#select-artist').hide();
    $('#get-genres').removeAttr('disabled');
    $('#search').removeAttr('disabled');
});

function capitalize(str) {
    "use strict";
    return str.toLowerCase().replace(/^.|\s\S|-\S/g, function (a) { return a.toUpperCase(); });
}

var lookupArtist = function (artist, cb) {
    "use strict";
    var request = 'http://developer.echonest.com/api/v4/artist/search?api_key=' + apikey + '&callback=?&format=jsonp';
    $.getJSON(request, { name: artist }, function (data) {
        cb(data.response.artists);
    });
};

function lookupGenreById(artistId) {
    "use strict";
    var request = 'http://developer.echonest.com/api/v4/artist/terms?api_key=' + apikey + '&callback=?&format=jsonp';

    $("#genres").empty();
    $.getJSON(request, {
        id: artistId,
        sort: 'weight'
    }, function (data) {
        var items = [];
        if (data.response.terms === undefined) {
            items.push('<tr><td>Could not find the artist...</td></tr>');
        } else {
            items.push('<tr>');
            items.push('<th>Genre</th>');
            items.push('<th>Weight</th>');
            items.push('<th>Frequency</th>');
            items.push('</tr>');
            $.each(data.response.terms, function () {
                items.push('<tr>');
                items.push('<td>' + capitalize(this.name) + '</td>');
                items.push('<td>' + this.weight.toFixed(2) + '</td>');
                items.push('<td>' + this.frequency.toFixed(2) + '</td>');
                items.push('</tr>');
            });
        }
        $("#genres").append(items.join(''));
    });
}

function lookupGenre(artist) {
    "use strict";
    var select, items;

    artist = artist || "";
    if (artist.length === 0) {
        return;
    }

    lookupArtist(artist, function (artists) {
        artists = artists || [];
        if (artists.length === 1) {
            lookupGenreById(artists[0].id);
        } else {
            select = $('#select-artist');

            items = [];
            $.each(artists, function () {
                items.push('<option value="' + this.id + '">' + this.name + '</option>');
            });
            select.append(items.join(''));
            select.show();
        }
    });
}

// test_artist_catalog", "id": "CAZESQU1350D56AAAF
