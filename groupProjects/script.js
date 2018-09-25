const app = {};

//store API variable in a property
app.apiURL = `https://api.spotify.com/v1/`;
//Allow the user to enter some names.
//Using the events method, upon submit get some data.
app.events = function () {
    $('form').on('submit', function(e){
        //upon submit, stop it from defaulting to page.
        e.preventDefault();
        let artists = $('input[type=search]').val();
        console.log(artists);
        //take comma separated list ^ and make an array out of it.
        artists = artists.split(',');
        let search = artists.map(artistName => app.searchArtist(artistName));

        app.retrieveArtistInfo(search);
        console.log(search);

    }); 
};

//Go to Spotify and get the artists.
//Make a method that is going to make our AJAX requests.  This function returns this =>...
app.searchArtist = (artistName) => $.ajax({
    url: `${app.apiURL}/search`,
    method: 'GET',
    dataType: 'json',
    data: {
        q: artistName,
        type: 'artist'
    }
});

//with the ids we want to get albums.
app.getArtistAlbums =  (artistID) => $.ajax({
    url: `${app.appUrl}/artists/${artistId}/albums`,
    method: 'GET',
    dataType: 'json',
    data: {
        q: artistName,
        type: 'artist',
    }
})


//Then get tracks.
app.getArtistTracks = (id) => $.ajax({
    url: `${app.apiUrl}/albums/${id}/tracks`,
    method: 'GET',
    dataType: 'json',

})


//Then build playlist.
app.buildPlayList = function (tracks){
    $.when(...tracks)
    .then((...tracksResults) => {
    tracksResults = tracksResults.map(getFirstElement)
        .map(item => item.items)
        .reduce(flatten, [])
        .map(item => item.id);
        const randomTracks = [];
        for (let i = 0; i < 30; i++) {
            randomTracks.push(getRandomTrack(tracksResults));
        }
        //taking an array and joining it into a string.
        randomTracks.join();
        const baseUrl = `https://embed.spotify.com/?theme=white&uri=spotify:trackset:My Playlist:${randomTracks.join()}`;

        //create a small widget list that when you click & you're already logged into Spotify, will play tunes natively in Spotify app.
        $('.playlist').html(`<iframe src="${baseUrl}" height="400"></iframe>`);

    });

}

app.retrieveArtistInfo = function (search){
    $.when(...search)
    .then((...results) => {
        results = results.map(getFirstElement)
        .map((res => res .artists.items[0].id)
        .map(id => app.getArtistAlbums(id)));
        console.log(results); 
    
        app.retrieveArtistTracks(results);
    });
    
};

app.retrieveArtistTracks = function (artistAlbums){
    $.when(...artistAlbums)
    .then((...albums) => {
    albumIds = albums.map(getFirstElement)
    .map(res => res.items)
    .reduct(flatten,  [])
    .map(album => album.id)
    .map(ids => app.getArtistTracks(ids));
app.buildPlayList(albumIds);
    })
};

const getFirstElement = (item) => item[0]; 

const flatten = (prev, curr) => [...prev, curr];

const getRandomTrack = (trackArray) => {
    const randoNum = Math.floor(Math.random() * trackArray.length);
    return trackArray[randoNum];
}

app.init = function() {
    //call method
    app.events();
};

$(app.init);