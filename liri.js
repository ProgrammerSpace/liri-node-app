// Import required packages
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);

var input = process.argv;

// Switch between expected commands
switch (input[2]) {
    case "concert-this":
        concertThis(input[3]);
        break;
    case "spotify-this-song":
        spotifyThisSong(input[3]);
        break;
    case "movie-this":
        movieThis(input[3]);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log("Invalid input");
        break;
}

// Function to fetch data from bandsintown
function concertThis(artist) {
    let queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(queryUrl)
        .then(
            function (response) {
                console.log('\x1b[33m%s\x1b[0m', 'Band Data');
                console.log('\x1b[33m%s\x1b[0m', "----------------------------");
                console.log('Venue: ' + response.data[0].venue.name);
                console.log('Location: ' + response.data[0].venue.city + ", " + response.data[0].venue.region);
                console.log("Date: " + moment(response.data[0].datetime).format("MM/DD/YY"));
                console.log('\x1b[33m%s\x1b[0m', "----------------------------");
            }
        );
}

// Function to grab song details from node-spotify-api
function spotifyThisSong(song) {
    if (song === undefined) {
        song = "The Sign";
    }
    spotify.search({ type: 'track', query: song, limit: 1 }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        let artists = "", Preview = "";
        if (data.tracks.items[0].preview_url == null) {
            Preview = "No link found";
        } else {
            Preview = data.tracks.items[0].preview_url;
        }
        for (let i = 0; i < data.tracks.items[0].artists.length; i++) {
            if (i != 0) {
                artists += ", ";
            }
            artists += data.tracks.items[0].artists[i].name;
        }
        console.log('\x1b[33m%s\x1b[0m', 'Song Data');
        console.log('\x1b[33m%s\x1b[0m', "----------------------------");
        console.log("Artist(s): " + artists);
        console.log("Song's name: " + data.tracks.items[0].name);
        console.log("Preview Link: " + Preview);
        console.log("Album: " + data.tracks.items[0].album.name)
        console.log('\x1b[33m%s\x1b[0m', "----------------------------");
    });
}

// Function to fetch data on movie from omdbapi
function movieThis(movie) {
    if (movie === undefined) {
        movie = "Mr. Nobody";
    }
    let queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&tomatoes=true&apikey=trilogy";
    axios.get(queryUrl)
        .then(
            function (response) {
                console.log('\x1b[33m%s\x1b[0m', 'Movie Data');
                console.log('\x1b[33m%s\x1b[0m', "----------------------------");
                console.log("Title: " + response.data.Title);
                console.log("Released year: " + response.data.Year);
                console.log("Imdb Rating: " + response.data.Ratings[0].Value);
                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                console.log("Movie produced in: " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
                console.log('\x1b[33m%s\x1b[0m', "----------------------------");
            }
        );
}

// Reads data from text file and do what it says
function doWhatItSays() {
    fs.readFile('./random.txt', 'utf8', function (error, data) {
        if (error) {
            return console.log(error);
        }
        let fileContent = data.split(",");
        let searchString = fileContent[1].replace(/["]/g, '');
        switch (fileContent[0]) {
            case "concert-this":
                concertThis(searchString);
                break;
            case "spotify-this-song":
                spotifyThisSong(searchString);
                break;
            case "movie-this":
                movieThis(searchString);
                break;
            default:
                console.log("Invalid input");
                break;
        }
    });
}