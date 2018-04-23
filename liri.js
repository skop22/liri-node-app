require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("file-system");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var userMenu = process.argv[2];
var userArgs = process.argv;
var userQuery = "";

for (var i = 3; i < userArgs.length; i++) {

	if (i > 3 && i < userArgs.length) {
		userQuery = userQuery + "+" + userArgs[i];
	}
	else {
		userQuery += userArgs[i];
	};
};

if (userMenu === "my-tweets") {
	var params = {id:'jskophammer'};

	client.get('statuses/user_timeline.json?count=20', params, function(error, tweets, response) {
		
		if(!error){
			for (let i=0;i<tweets.length;i++){
				console.log(tweets[i].text);
				console.log("_________");
			};
		}
		else {
			console.log(error);
		};
	});
} else if (userMenu === "spotify-this-song") {
	spotify.search({ type: 'track', query: userQuery, limit: '1'}, function(err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
		};
		
		console.log("Artist: " + data.tracks.items[0].artists[0].name);
		console.log("Album: " + data.tracks.items[0].name);
		console.log("Song Link: " + data.tracks.items[0].external_urls.spotify);
	});
} else if (userMenu === "movie-this") {
	var queryUrl = "http://www.omdbapi.com/?t=" + userQuery + "&y=&plot=short&apikey=trilogy";

	console.log(queryUrl);

	request(queryUrl, function(error, response, body) {

	  if (!error && response.statusCode === 200) {
		console.log("Title: " + JSON.parse(body).Title);
		console.log("Release Year: " + JSON.parse(body).Year);
		console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
		console.log("Rotten Tomatoes Score: " + JSON.parse(body).Ratings[1].Value);
		console.log("Country Produced: " + JSON.parse(body).Country);
		console.log("Language: " + JSON.parse(body).Language);
		console.log("Plot: " + JSON.parse(body).Plot);
		console.log("Actors: " + JSON.parse(body).Actors);
	  }
	});
}else if (userMenu === "do-what-it-says") {
	fs.readFile('random.txt', 'utf8', function(err,data){
        if(err) throw err;
		var inputArr = data.split(',');
		// console.log(inputArr)
		userMenu = inputArr[0];
		userArgs = inputArr[1];
	});
}else {
	console.log("Invalid input, please select again.");
	console.log("Please input one of the following:");
	console.log("__________________________________");
    console.log("my-tweets");
    console.log("spotify-this-song 'song title artist'");
	console.log("movie-this 'movie title'");
	console.log("do-what-it-says");
};
