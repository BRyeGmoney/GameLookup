//var http = require('http');
var express = require('express');
var request = require("request");
var xml2js = require("xml2js");
var app = express();
var xmlparser = new xml2js.Parser();
var configSettings;

/*GiantBomb Requests*/
function searchGameByNameGB(searchTerm, callback) {
    console.log("Giantbomb game search");
    
    var options = {
        url: configSettings.options[0].host + "/api/search/?api_key=" + configSettings.options[0].key + "&format=json&query=\"" + searchTerm + "\"&resources=game",
        headers: {
            "User-Agent": "javascript"
        }
    };
    request(options, callback);
}

function getGameByKeyGB(gameKey, callback) {
    console.log("Giantbomb key Search");
    
    var options = {
        url: configSettings.options[0].host + "/api/game/3030-" + gameKey + "/?api_key=" + configSettings.options[0].key + "&format=json",
        headers: {
            "User-Agent": "javascript"
        }
    };
    request(options, callback);
}

/*GamesDB Requests*/
function searchGameByNameGDB(searchTerm, callback) {
    console.log("GamesDB game search");
    
    var options = {
        url: configSettings.options[1].host + "/api/GetGamesList.php?name=" + searchTerm
    };
    request(options, callback);
}

function getGameByKeyGDB(gameKey, callback) {
    console.log("GamesDB key search");
    
    var options = {
        url: configSettings.options[1].host + "/api/GetGame.php?id=" + gameKey
    };
    request(options, callback);
}

function init() {
    LoadConfigSettings();
}

function LoadConfigSettings() {
    //read our config settings
    var fs = require('fs');
    configSettings = JSON.parse(fs.readFileSync("config.json", "utf8"));
    console.log("config file loaded");
}

//run the init.
init();

app.get("/", function(req, res) {
    res.send("Hello World");
});

app.get("/searchGame/", function(req, res) {
    searchGameByNameGB(req.param("game"), function(error, response, body) {
        
        if (!error && response.statusCode == 200) {
            console.log("Successful GB game search");
            var info = JSON.parse(body);
            res.jsonp(info);
        } else {
            console.log("Unuccessful GB game search");
            res.send(response.statusCode);
        }
        
    });
    
});

app.get("/searchKey/", function(req, res) {
   getGameByKeyGB(req.param("key"), function(error, response, body) {
       
       if (!error && response.statusCode == 200) {
           console.log("Successful GB key search");
           var info = JSON.parse(body);
           res.jsonp(info);
       } else {
           console.log("Unsuccessful GB key search");
           res.send(response.statusCode);
       }
   }); 
});

app.get("/searchGameGamesDB/", function(req, res) {
   searchGameByNameGDB(req.param("game"), function(error, response, body) {
       if (!error && response.statusCode == 200) {
           console.log("Successful GamesDB game search");
           //we now have to parse the xml, result is the object
           xmlparser.parseString(body, function(err, result) {
               res.jsonp(result);
           });
       } else {
           console.log("Unsuccessful GamesDB game search");
           res.send(response.statusCode);
       }
   });
});

app.get("/searhGamesDBByKey/", function(req, res) {
   getGameByKeyGDB(req.param("key"), function(error, response, body) {
       if (!error && response.statusCode == 200) {
           console.log("Successful GamesDB key search");
           //we now have to parse the xml
           xmlparser.parseString(body, function(err, result) {
              res.jsonp(result); 
           });
       } else {
           console.log("Unsuccessful GamesDB key search");
           res.send(response.statusCode);
       }
   });
});


function sendInfo(info, res) {
    res.send(info.error);
}

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    
    console.log("App is listening at http://%s:%s", host, port);
});