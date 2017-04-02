var lock = require('./keys.js');
var inquirer = require("inquirer");
var request = require("request");
var Twitter = require('twitter');
var spotify = require("spotify");
var fs = require('fs');


function pickOne (){

    inquirer.prompt([
        {
            type: "list",
            message: "Pick an option",
            choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
            name: "selection"
        }
    ]).then(function(user) {

        console.log("==============================================");
        console.log("");
        console.log("You've selected': " + user.selection);
        console.log("");
        console.log("==============================================");
        
        if (user.selection == "my-tweets") {
        

        //  my-tweets
            var error = function (err, response, body) {
                console.log('Sorry Something Went Wrong', err);
            };
            var success = function (data) {
                console.log('Data' , data);
            };
            
            var tweet = lock.twitterKeys;

            var client = new Twitter(tweet);
            var params = {screen_name: 'thatguy609', count: '20'};
            client.get('statuses/user_timeline', params, function(error, tweets, response) {
                if (!error) {
                    for(i=0; i<tweets.length; i++){
                        console.log("--------------------------------");
                        console.log("User Name: " + tweets[i].user.screen_name);
                        console.log("Time: " + tweets[i].created_at);
                        console.log("Tweet: " + tweets[i].text);
                        console.log("--------------------------------");
                    };
                }
            });
        } else if (user.selection == "spotify-this-song") {
       

        //  spotify-this-song
            inquirer.prompt([
                {
                type: "input", 
                name: "name", 
                message: "Name a Song?"
                },
            ]).then(function(song){

                spotify.search({ type: 'track', query: song.name }, function(err, data) {
                    if ( err ) {
                        console.log('Error occurred: ' + err);
                        return;
                    } else {
                        console.log("-------------------------------");
                        console.log("Artist: " + data.tracks.items[0].artists[0].name);
                        console.log("Song Title: " + data.tracks.items[0].name);
                        console.log("Spotify Preview Link: " + data.tracks.items[0].external_urls.spotify);
                        console.log("Album: " + data.tracks.items[0].album.name);
                        console.log("-------------------------------");
                    };
                });
            });
        } else if (user.selection == "movie-this") {
      

       // movie-this
            inquirer.prompt([
                {
                type: "input",
                name: "name",
                message: "Choose a movie?"
                },
            ]).then(function(movie) {
                if (movie.name == "") {
                    
                    var title = "Mr. Nobody";
                    var newTitle = title.split(' ').join('+');
                    var url = "http://www.omdbapi.com/?t=" + newTitle + "&y=&plot=short&r=json";

                    console.log(url);

                    
                    request(url, function(error, response, body) {

                        
                        if (!error && response.statusCode === 200) {

                            
                            console.log("----------------------------------------------");
                            console.log("");
                            console.log("Film Title: " + JSON.parse(body).Title);
                            console.log("");
                            console.log("----------------------------------------------");
                            console.log("");
                            console.log("Release Year: " + JSON.parse(body).Year);
                            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                            console.log("Country of Origin: " + JSON.parse(body).Country);
                            console.log("Language: " + JSON.parse(body).Language);
                            console.log("Plot: " + JSON.parse(body).Plot);
                            console.log("Actors: " + JSON.parse(body).Actors);
                            console.log("");
                            console.log("----------------------------------------------");
                        }
                    });
                } else {
                    var title = movie.name;
                    var newTitle = title.split(' ').join('+');
                    var url = "http://www.omdbapi.com/?t=" + newTitle + "&y=&plot=short&r=json";

                    console.log(url);

                    
                    request(url, function(error, response, body) {

                        // successful request
                        if (!error && response.statusCode === 200) {

                            // Getting movie info
                            console.log("----------------------------------------------");
                            console.log("");
                            console.log("Film Title: " + JSON.parse(body).Title);
                            console.log("");
                            console.log("----------------------------------------------");
                            console.log("");
                            console.log("Release Year: " + JSON.parse(body).Year);
                            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                            console.log("Country of Origin: " + JSON.parse(body).Country);
                            console.log("Language: " + JSON.parse(body).Language);
                            console.log("Plot: " + JSON.parse(body).Plot);
                            console.log("Actors: " + JSON.parse(body).Actors);
                            console.log("");
                            console.log("----------------------------------------------");
                        }
                    });
                };
            });
        } else if (user.selection == "do-what-it-says") {
        //  do-what-it-says
            fs.readFile('random.txt', 'utf8', function (err,data) {
                if (err) {
                    return console.log(err);
                } else {
                    var options  = data.split(',');
                    var songTitle = options[1];
                    console.log(songTitle);
                    spotify.search({ type: 'track', query: songTitle }, function(err, data) {
                        if ( err ) {
                            console.log('Something went wrong: ' + err);
                            return;
                        } else {
                            console.log("-------------------------------");
                            console.log("Artist: " + data.tracks.items[0].artists[0].name);
                            console.log("Song Title: " + data.tracks.items[0].name);
                            console.log("Spotify Preview Link: " + data.tracks.items[0].external_urls.spotify);
                            console.log("Album: " + data.tracks.items[0].album.name);
                            console.log("-------------------------------");
                        };
                    });
                };
            });
        } 
    });
};

pickOne ();