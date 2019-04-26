require("dotenv").config();
// Require statements and variables
let Spotify = require("node-spotify-api");
let keys = require("./keys.js"); 
let spotify = new Spotify(keys.spotify);
let axios = require("axios");
let fs = require("fs");
//Format Date and Time
let moment = require("moment");
moment().format();
const divider = "\n\n....................\n\n"

// User input variables
const command = process.argv[2];
let search = process.argv.slice(3).join("+");
console.log(`\nYou searched for: ${search}\n`);

// Command
switch (command) {
    case "concert-this":
        concert();
        break;
    case "spotify-this-song":
        song();
        break;
    case "movie-this":
        movie();
        break;
    case "do-what-it-says":
        doWhatever();
        break;
};

// FUNCTION: concert-this
async function concert() {
    const URL = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp";
    const response = await axios.get(URL);
    const result = response.data[0];
    const lineup = result.lineup;
    const venue = result.venue.name;
    const city = result.venue.city;
    const state = result.venue.region;
    const date = moment(result.datetime).format("MM/DD/YYYY");
    
    const concertData = [
        `Lineup: ${lineup.join(", ")}`,
        `Venue: ${venue}`,
        `Location: ${city}, ${state}`,
        `Date: ${date}`,
        `${divider}`
    ];

    if(!search) {
        search = "Sabaton";
        console.log("Showing results for Sabaton");
    }
    console.log(concertData.join("\n"));
}

// FUNCTION: spotify-this
function song() {
    spotify.search({
        type: "track",
        query: search,
        limit: 5
    }, function(err, data) {
        if(!search) {
            search = "imperial march";
            console.log("For the Empire");
        } else {
            for(i = 0; i < data.tracks.items.length; i++) {
                const results = data.tracks.items[i];
                const songResult = [
                    `Song: ${results.name}`,
                    `Artist: ${results.artists[0].name}`,
                    `Album: ${results.album.name}`,
                    `Preview: ${results.preview_url}`,
                    `${divider}`
                ];
                console.log(songResult.join("\n"));
            }
        }
    });
}

// FUNCTION: movie-this
async function movie() {
    if (!search) {
        search = "RED";
    }
    const response = await axios.get("http://www.omdbapi.com/?t=" + search + "&apikey=f6af65be")
    const result = response.data;
    // console.log(result)
    const movieData = [
        `Title: ${result.Title}`,
        `Year: ${result.Year}`,
        `IMDB Rating: ${result.imdbRating}`,
        `Country: ${result.Country}`,
        `Language: ${result.Language}`,
        `Actors: ${result.Actors}`,
        `Plot: ${result.Plot}`,
    ];
    const displayString = movieData.join("\n") + divider;
    console.log(displayString)
}

// FUNCTION: do-something
function doWhatever() {
    const data = fs.readFileSync("random.txt").toString();
    if(data) {
        console.log(data + divider);
    }
}

module.exports